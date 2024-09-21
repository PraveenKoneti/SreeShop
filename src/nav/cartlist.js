import { useState, useEffect } from "react";
import swal from "sweetalert";
import { Navigate } from "react-router-dom";
import moment from "moment";
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { deleteData, fetchData, postData, putData } from "../Api/apihandler";
import { config } from "../config";

const Cartlist = () =>
{
    const [ordered, setOrdered] = useState(false);
    

            //  TO DELETET THE PARTICULAR PRODUCT FROM THE CARTLIST

    const deleteproduct = async(product) =>
    {
        let response = await deleteData(`${config.deletecartlist}/${product._id}`)
        if(response && response.message !== "")
        {
            swal(response.message,"product Removed from Cartlist","success")
            .then(()=>{
                getdata();
            })
        }
        else 
            swal("Internal Server Error","","warning");

    }


        //   TO UPDATE THE PARTICULAR PROUDCT QUANTITY IN CARTLIST

    const updateqty = async(product, status) =>
    {
        if(status === "add")
        {
            if(product.productquantity <= 5)
                product["productquantity"] = product.productquantity + 1;
            else
                swal("Product Quantity Alert","The quantity is more than 5 and hasn't been taken","warning");
        }
        else
            product["productquantity"] = product.productquantity - 1;


        if(product.productquantity === 0)
            deleteproduct(product);
        else
        {
            if(product.productquantity <= 5)
            {
                let response = await putData(`${config.updatecartlist}/${product._id}`, product)
                if(response && response.message !== "")
                {
                    swal(response.message,"","success");
                    getdata();

                    if(status === "add" && selecteditems.length !== 0)
                        selectcartitem("true", product, "true");
                    else if(product.productquantity > 0 && selecteditems.length !== 0)
                        selectcartitem("false", product, "false");
                    else
                        amount[0].value = 0;
                }
                else 
                    swal("Internal Server Error","","warning");
            }
        }
    }


    let[cname, pickcname] = useState("");
    let[cmobile, pickcmobile] = useState("");
    let[cemail, pickcemail] = useState("");
    let[caddress, pickcaddress] = useState("");

    let[cnameerror, updatecnameerror] = useState("true");
    let[cmobileerror, updatecmobileerror] = useState("true");
    let[cemailerror, updatecemailerror] = useState("true");
    let[caddresserror, updatecaddresserror] = useState("true");

    let[logedin, updatelogedin] = useState("true");

    let[customer, updatecustomer] = useState( { name: '', mobile: '', email: '', address: '', totalamount: 0, paymentmethod: '', itemslist: []} );
    

    const order = async () => {
        let products = selecteditems.length > 0 ? selecteditems : cartlist;

        let customers = { 
            name: cname, 
            mobile: cmobile, 
            email: cemail, 
            address: caddress,
            orderstatus: "ordered", 
            totalamount: totalamount - discount, 
            paymentmethod: selectedpaymentmethod,
            itemslist: products
        };
        
        updatecustomer(customers);
        customers["date"] = currentDate;
        customers["id"] = localStorage.getItem("userid");

        try {
            const orderinfo = await postData(config.saveorder, customers);
            generateAndSendPDF(orderinfo.orderId, customers)
        } catch (error) {
            console.error("Error placing order:", error);
            swal("Error", "Failed to place order", "error");
        }
    }

    const [selectedpaymentmethod, setselectedpaymentmethod] = useState("");

    const handlePaymentMethodSelect = (method) => {
        setselectedpaymentmethod(method);
    };

    const generateAndSendPDF = async (orderId, customer) => {
        const input = document.getElementById("mybill");
        const margin = 10; // Margin value in mm
        try {
            const canvas = await html2canvas(input, { scale: 2 });
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            const pageHeight = pdf.internal.pageSize.getHeight();
            let heightLeft = pdfHeight;
            let position = margin;
    
            pdf.addImage(imgData, 'PNG', margin, position, pdfWidth - 2 * margin, pdfHeight);
            heightLeft -= (pageHeight - 2 * margin);
    
            while (heightLeft >= 0) {
                position = heightLeft - pdfHeight + margin;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', margin, position, pdfWidth - 2 * margin, pdfHeight);
                heightLeft -= (pageHeight - 2 * margin);
            }
    
            const pdfBlob = pdf.output("blob");
            console.log('Generated PDF Blob:', pdfBlob); // Debugging
    
            // Create FormData and append fields
            const formData = new FormData();
            formData.append("pdf", pdfBlob, "SreeShop Order.pdf");
            formData.append("toemail", customer.email);
            formData.append("mysubject", "Your SreeShop Order Confirmation");
            formData.append("mymessage", `Dear ${customer.name},

            Thank you for shopping with SreeShop! Your order has been successfully placed and is now being processed.

            Below are the details of your order:

            Order ID: ${orderId}

            Name: ${customer.name}
            Mobile: ${customer.mobile}
            Email: ${customer.email}
            Address: ${customer.address}
            Total Amount: ${customer.totalamount}
            Payment Method: ${customer.paymentmethod}
            Date: ${customer.date}

            Thank you for your purchase!`);

            console.log('FormData Entries:');
            formData.forEach((value, key) => {
                console.log(`${key}: ${value}`);
            });

    
            let response = await axios.post(config.sendemailpdf, formData);
            if (response.data.message === "Email Sent Successfully!") {
                swal("Ordered Successfully", "", "success")
                .then(() => {
                    const modal1 = window.bootstrap ? window.bootstrap.Modal.getInstance(document.getElementById('myModal')) : null;
                    if (modal1) modal1.hide();
                    const modal2 = window.bootstrap ? window.bootstrap.Modal.getInstance(document.getElementById('myModal2')) : null;
                    if (modal2) modal2.hide();
                    setOrdered(true);
                });
            } else {
                swal("Error Sending Email", "", "error");
            }
        } catch (error) {
            console.error("Error generating PDF or sending email:", error);
            swal("Error Sending Email", "", "error");
        }
    };
    


    const handlepaymentsubmit = () => {
        if (!cname && !cmobile && !cemail && !caddress) 
        {
            swal("Please Enter the All Details","Name, Mobile, E-Mail, Address","warning");
            if(cname === "")
                updatecnameerror("false");
            if(cmobile === "")
                updatecmobileerror("false");
            if(cemail === "")
                updatecemailerror("false");
            if(caddress === "")
                updatecaddresserror("false");
            return false;
        }
        if(selectedpaymentmethod==="")
            swal("Please Select Payment Method","","warning");
        else
        {
            order();
        }
    };




        //    TO CALCULATE THE ALL THE PRODUCTS PRICE WILL BE ADDED AND STORED THE TOTALAMOUNT VARIABLE


    let[totalamount, updatetotalamount] = useState(0);
    const calculatetotalamount = () =>
    {
        if(selecteditems.length === 0)
        {
            let amount = 0;
            cartlist.forEach(product => {
                amount = amount + parseInt(product.productprice) * parseInt(product.productquantity);
            });
            updatetotalamount(amount);
        }
    }

    
    // TO SELECT THE PARTICULAR PRODUCTS FROM CARTLIST
    
    let[selecteditems, pickselecteditems] = useState( [] );
    let[amount, updateamount] = useState( [ {value:0} ] );

    const selectcartitem = (check, product, incre="") =>
    {
        if(check === "false")
        {
            if(incre === "false")
            {
                totalamount = totalamount - (parseInt(product.productprice) * parseInt(product.productquantity+1));
                amount[0].value = totalamount;
                amount = parseInt(product.productquantity) * parseInt(product.productprice);
                updatetotalamount( totalamount + amount );
                let update = [{value : totalamount + amount}];
                updateamount(update); 
            }
            else
            {
                amount = parseInt(product.productquantity) * parseInt(product.productprice);
                updatetotalamount( totalamount - amount );
                let update = [{value : totalamount-amount}];
                updateamount(update); 
                selecteditems.splice(0,1);
            }
 
            calculatetotalamount(); 
        }
        else
        {   
            if(incre === "true")
            {
                totalamount = totalamount - product.productprice * (product.productquantity - 1);
                amount[0].value = totalamount;
            }

            let total = amount[0].value + (parseInt(product.productquantity) * parseInt(product.productprice));
            let update = [{value : total}];
            updateamount(update);
            updatetotalamount( total );

            if(incre !== "true")
                pickselecteditems( [...selecteditems, product] );
        }

    }

    


        //   TO GET THE CARTLIST DATA FROM THE BACKEND AND STRORED THE DATA IN CARTLIST VARIABLE

    let[cartlist, pickcartlist] = useState( [] );
    let[loginin, pickloginin] = useState(false);
    const getdata = async() =>
    {
        if(localStorage.getItem("userid") != null)
        {
            let response = await fetchData(`${config.getcartlist}?id=${localStorage.getItem("userid")}`)
            if(response.status)
                pickcartlist( response.items );
            else 
            {
                swal("Please Login",response.message,"warning")
                .then(res=>{
                    pickloginin(true);
                })
            }
        }
        else
        {
            swal("Please Login / Signup","You have Account Login / Signup","warning")
            .then(()=>{
                pickloginin(true);
            })
        }

    }

    let subtotal = 0;
    let discount = 0;
    useEffect(()=>{getdata();}, []);
    useEffect(()=>{calculatetotalamount();}, [cartlist]);

    const [currentDate, setCurrentDate] = useState("");

    useEffect(() => {
        getCurrentDate();
    }, []);

    const getCurrentDate = () => {
        const date = moment().format('MMMM Do YYYY, h:mm:ss a');
        setCurrentDate(date);
    }



    // if (Object.keys(customer).length > 0) {
    //     return <Navigate to="/mybill" state={{ customer }} replace />;
    // }

    if(ordered === true)
        return <Navigate to="/myorders" />

    if(loginin === true)
        return <Navigate to="/userlogin" /> 
    

    if(cartlist.length > 0)
    {
        return(
            <div className="container">
                <div className="row mt-4 me-0 ps-0 m-1 ">

                    <div className="col-sm-8 col-md-8 col-lg-8 col-xl-8 col-xxl-8 m-auto shadow-lg pt-3 mt-3 pb-4 cartlist-scroll">
                        <div className="row p-0 m-0">
                            <h1 className="col-8 text-start carthead text-warning"> <i className="fa fa-shopping-bag"></i>  Shopping Bag </h1>
                            <h3 class="col-3 text-end ms-auto align-self-end carthead1"> <i class="fa fa-indian-rupee-sign"></i> Price </h3>
                        </div>

                        <hr size={4} className="bg-dark" />

                        {
                            cartlist.map((cartproduct, index)=>{
                                subtotal += (cartproduct.productprice);
                                discount += Math.round(cartproduct.productprice * 0.06);
                                return(
                                    <div className="row mt-2 ps-2 pe-2 pb-3 cartprice">
                                        <div className="col-3 pb-3">
                                            <div class="form-check">
                                                <input type="checkbox" class="form-check-input border-2" size="30" 
                                                    onChange={obj=>selectcartitem(obj.target.checked ? cartproduct : 'false', cartproduct)}
                                                />
                                            </div>
                                            <img className="text-center cartimg" src={`${config.host}/productimages/${ cartproduct.productimage}`} width="100%" height="200"  />
                                        </div>

                                        <div className="col-6 pb-3">
                                            <h5 className="mt-3"> {cartproduct.productname} </h5>
                                            <h5 className="mt-2"> Rs. {cartproduct.productprice} /__</h5>
                                            <p className="text-success mt-1"> {cartproduct.productactive} </p>
                                            <div class="btn-group mt-1">
                                                <button onClick={updateqty.bind(this, cartproduct, "sub")} className="btn btn-danger rounded-0 cartbtn"> - </button>
                                                <button className="btn btn-white rounded-0 border border-4 cartbtn"> {cartproduct.productquantity} </button>
                                                <button onClick={updateqty.bind(this, cartproduct, "add")} className="btn btn-primary rounded-0 cartbtn"> + </button>
                                            </div>   
                                        </div>
                                        <div className="col-3 text-end pb-3"> 
                                            <p onClick={deleteproduct.bind(this, cartproduct)} className="text-end"> <i className="fa-regular fa-circle-xmark fs-3 mb-2 text-danger"></i> </p>
                                            <h3> <b className="cartprice"> <i class="fa fa-indian-rupee-sign"></i> {(cartproduct.productquantity * cartproduct.productprice)} </b> </h3>
                                        </div>

                                        <hr size={4} className="bg-dark"/>

                                    </div>

                                    
                                )
                            })
                        }

                        <div className="row text-end">
                            <h5> <b> Subtotal ({cartlist.length}item) : <i class="fa fa-indian-rupee-sign"></i> {subtotal} </b> </h5>
                        </div>
                    </div>

                    <div className="col-sm-4 col-md-4 col-lg-4 col-xl-4 co-xxl-4 ms-auto me-auto cartpay mt-3">
                        <div className="card border-0 shadow-lg">
                            <div className="card-header bg-warning p-2 text-white text-center"> <h3> <i class="fa-solid fa-hand-holding-dollar"></i> Price Details </h3> </div>
                            <div className="card-body border-0"> 
                                <div className="row mb-2 m-0 p-0">
                                    <div className="col-6 mt-4 fs-5"> <p>Total Price </p> </div>
                                    <div className="col-6 mt-4 fs-5 text-end"> <p> <b><i class="fa fa-indian-rupee-sign me-1"></i> {totalamount - discount} </b> </p> </div>
                                </div>

                                <div className="row mb-2 m-0 p-0">
                                    <div className="col-6 fs-5"> <p>Shipping Charges </p> </div>
                                    <div className="col-6 fs-5 text-end"> <p> <b className="text-decoration-line-through"><i class="fa fa-indian-rupee-sign"></i> 100 </b> <b className="text-success ms-2"> Free </b>  </p> </div>
                                </div>

                                <div className="row mb-2 m-0 p-0">
                                    <div className="col-6 fs-5"> <p>Processing Fee </p> </div>
                                    <div className="col-6 fs-5 text-end"> <p> <b className="text-decoration-line-through"><i class="fa fa-indian-rupee-sign"></i> 160 </b> <b className="ms-3"> <i class="fa fa-indian-rupee-sign"></i> 100 </b>  </p> </div>
                                </div>

                                <div className="row mb-2 m-0 p-0">
                                    <div className="col-6 fs-5"> <p> Discount </p> </div>
                                    <div className="col-6 fs-5 text-end"> <p> <b> - <i class="fa fa-indian-rupee-sign"></i> {discount} </b> </p> </div>
                                </div>

                                <hr size={4} className="bg-dark" />
                            </div>
                            <div className="card-footer bg-black text-white pt-4 pb-4">
                                <div className="row mb-4 m-0 p-0 bg-black">
                                    <div className="col-6 fs-5"> <p> <b> Amount Payable </b>  </p> </div>
                                    <div className="col-6 fs-5 text-end"> <p> <b> <i class="fa fa-indian-rupee-sign"></i> {totalamount - discount} </b> </p> </div>
                                </div>

                                <div className="row mb-2 m-0 p-0 bg-black">
                                    {
                                        (localStorage.getItem("userid") !== null) ?
                                            (<button  className="btn btn-primary btn-md btn-sm btn-lg"  data-bs-toggle="modal" data-bs-target="#myModal"> Buy Now </button>) 
                                            :
                                            (<button onClick={obj=>updatelogedin()} className="btn btn-primary btn-md btn-sm btn-lg"> Buy Now </button>)
                                    }
                                </div>
                                
                            </div>
                        </div>
                    </div>
                




                    <div className="modal fade" id="myModal">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h3 className="modal-title text-center"> Select Payment Method </h3>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                                </div>

                                <div className="modal-body">
                                    <div className="row">
                                        <h3 className="mb-2"> Enter Customer Details </h3>
                                        <div className="col-sm-5 m-auto mb-3">
                                            <input type="text" className="form-control" 
                                                onChange={obj=>pickcname(obj.target.value)} value={cname} placeholder="Enter Your Name"
                                                style={{ border:(cname === "")?(cnameerror === "false")?'4px solid red':'':'', boxShadow: (cname === "")?(cnameerror === "false")?'0px 0px 5px red':'':'' }}
                                            />
                                        </div>
                                        <div className="col-sm-5 m-auto mb-3">
                                            <input type="number" className="form-control" 
                                                onChange={obj=>pickcmobile(obj.target.value)} value={cmobile}  placeholder="Enter Your Mobile No"
                                                style={{ border:(cmobile === "")?(cmobileerror === "false")?'4px solid red':'':'', boxShadow: (cmobile === "")?(cmobileerror === "false")?'0px 0px 5px red':'':'' }}
                                            />
                                        </div>
                                        <div className="col-sm-5 ms-auto me-auto mb-3">
                                            <input type="email" className="form-control" 
                                                onChange={obj=>pickcemail(obj.target.value)} value={cemail} placeholder="Enter Your Email"
                                                style={{ border:(cemail === "")?(cemailerror === "false")?'4px solid red':'':'', boxShadow: (cemail === "")?(cemailerror === "false")?'0px 0px 5px red':'':'' }}    
                                            />
                                        </div>
                                        
                                        <div className="col-sm-5 m-auto mb-3">
                                            <textarea type="text" rows="2" className="form-control" placeholder="Enter the correct Address with Pincode" 
                                                onChange={obj=>pickcaddress(obj.target.value)} value={caddress}
                                                style={{ border:(caddress === "")?(caddresserror === "false")?'4px solid red':'':'', boxShadow: (caddress === "")?(caddresserror === "false")?'0px 0px 5px red':'':'' }}
                                            >    
                                            </textarea>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-8"> <h5> You are paying for 1 Order Request </h5> </div>
                                        <div className="col-4 text-end"> <h6> INR {totalamount-discount} </h6></div>
                                    </div>

                                    <div className="row bg-warning pt-2 pb-1 mb-3">
                                        <div className="col-8 text-white"> <h5> TOTAL AMOUNT TO BE PAID </h5> </div>
                                        <div className="col-4 text-end text-white"> <h6> INR {totalamount-discount} </h6></div>
                                    </div>

                                    <h4> PAYMENT METHOD </h4>

                                    <div className="row mt-3">

                                        <div className="col-12 col-sm-3 m-auto mt-2">
                                            <p className={`payment-option text-center shadow-lg p-1 pt-3 pb-3 ${selectedpaymentmethod === "Phone Pay" ? "bg-black text-white" : ""}`}
                                                onClick={() => handlePaymentMethodSelect("Phone Pay")}> 
                                                <i className="pi pi-phone" style={{ fontSize: '2rem', color: 'purple' }}></i> <br/>
                                                <b className="fs-5" style={{color: 'purple' }}> Phone Pay </b>
                                            </p>
                                        </div>

                                        <div className="col-12 col-sm-3 m-auto mt-2">
                                            <p className={`payment-option text-center shadow-lg  p-1 pt-3 pb-3 ${selectedpaymentmethod === "G Pay" ? "bg-black text-white" : ""}`}
                                                onClick={() => handlePaymentMethodSelect("G Pay")}> 
                                                <i className="fa-brands fa-google-pay" style={{ fontSize: '2rem', color: '#4285F4' }}></i> <br/>
                                                <b className="fs-5" style={{color: '#4285F4' }}> G Pay </b>
                                            </p>
                                        </div>

                                        <div className="col-12 col-sm-3 m-auto mt-2">
                                            <p className={`payment-option text-center shadow-lg p-1 pt-3 pb-3 ${selectedpaymentmethod === "Paytm" ? "bg-black text-white" : ""}`}
                                                onClick={() => handlePaymentMethodSelect("Paytm")}> 
                                                <i className="pi pi-wallet" style={{ fontSize: '2rem', color: '#003F6C' }}></i> <br/>
                                                <b className="fs-5" style={{color: '003F6C' }}> Paytm </b>
                                            </p>
                                        </div>
                                    </div>

                                </div>

                                
                                <div className="modal-footer">
                                    <button onClick={handlepaymentsubmit} type="button" className="btn btn-success m-auto" {...(cname !== "" && cmobile !== "" && cemail !== "" && caddress !== "" && selectedpaymentmethod !== "" ? {'data-bs-toggle': 'modal', 'data-bs-target': '#myModal2'} : {})}>Pay Now</button>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div class="modal" id="myModal2">
                        <div class="modal-dialog modal-lg">
                            <div class="modal-content">

                            <div class="modal-header">
                                <h4 class="modal-title"> Order Details </h4>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>

                            <div class="modal-body">
                                <div className="row mt-4" id="mybill">
                                    <div className="m-auto pt-3 shadow-lg">
                                        <div className="container ps-3 pe-3 mb-4 fs-1"> <i className="fa fa-shopping-bag text-warning"></i> SreeShop</div>

                                        <div className="row mb-4">
                                            <div className="col-7  bg-warning"> </div>
                                            <div className="col-3 m-0 p-0 text-center"> <p className=" m-0 p-0 fs-5"> INVOICE </p></div>
                                            <div className="col-2 bg-warning"> </div>
                                        </div>

                                        <div className="container ps-3 pe-3 m-auto mb-3">
                                            <div className="row">
                                                <div className="col-sm-5 col-md-5 col-lg-5 col-xl-5 col-xxl-5 me-auto">
                                                    <h2 className="mb-3"> Invoice to : </h2>
                                                    <h6> Name   : {customer.name} </h6>
                                                    <h6> Mobile : {customer.mobile} </h6>
                                                    <h6> Email  : {customer.email} </h6>
                                                    <p className="custom-date"> Address : {customer.address} </p>
                                                </div>
                                                <div className="col-sm-5 col-md-5 col-lg-5 col-xl-5 col-xxl-5 ms-auto  me-0 m-auto">
                                                    <div className="row">
                                                        <div className="col-6"> <h5 className="custom-date"> Invoice#</h5></div>
                                                        <div className="col-6"> <p className="custom-date"> 1234 </p> </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-6"> <h5 className="custom-date"> Date </h5> </div>
                                                        <div className="col-6"> <p className="custom-date"> {currentDate} </p> </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="container ps-3 pe-3 m-auto mb-3">
                                            <div className="row">
                                                <div className="col-sm-12 col-lg-12 col-md-12 col-xl-12 col-xxl-12 border p-0">
                                                    <table className="table table-bordered table-white text-center table-sm table-md table-lg table-xl table-xxl" cellPadding={10}>
                                                        <thead className="bg-black text-white">
                                                            <th> SL.</th>
                                                            <th> Item Description </th>
                                                            <th> Price </th>
                                                            <th> Qty </th>
                                                            <th> Total </th>
                                                        </thead>
                                                        <tbody>
                                                        {
                                                            customer.itemslist.map((product, index)=>{
                                                                return(
                                                                    <tr className="index">
                                                                        <td> {index + 1} </td>
                                                                        <td className="text-start"> {product.productname} </td>
                                                                        <td> {product.productprice} </td>
                                                                        <td> {product.productquantity} </td>
                                                                        <td> {product.productquantity * product.productprice} </td>
                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                        </tbody>
                                                        
                                                    </table>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="container">
                                            <div className="row">
                                                <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                                                    <h6 > Thank you for shopping with us! </h6>
                                                    <h6 className="mt-3 text-decoration-underline"> Terms & Conditions </h6>
                                                    <p className="fs-6"> Returns follow ShreeShop's policy, which may include fees or exclusions.</p>
                                                </div>
                                                <div className="col-sm-4 col-md-4 col-lg-4 col-xl-4 col-xxl-4 m-auto mt-2 me-0 ms-auto">
                                                    <div className="row mt-2 mb-3">
                                                        <div className="col-6"> <h6> Discount : </h6></div>
                                                        <div className="col-6"> <h6 className="text-end"> <i className="fa-solid fa-indian-rupee-sign me-1"></i>  {discount}   </h6></div>
                                                    </div>
                                                    <div className="row mt-2 mb-3">
                                                        <div className="col-6"> <h6> Sub Total : </h6></div>
                                                        <div className="col-6"> <h6 className="text-end"> <i className="fa-solid fa-indian-rupee-sign me-1"></i>  {customer.totalamount}   </h6></div>
                                                    </div>
                                                    <div className="row p-0 mt-3">
                                                        <div className="col-6"> <h6> Tax : </h6></div>
                                                        <div className="col-6"> <h6 className="text-end"> 0.00% </h6></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row mb-2">
                                            <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6 bg-black ms-auto">
                                                <div className="row p-2  text-white text-center">
                                                    <div className="col-7"> <h6> Payment-Method : </h6></div>
                                                    <div className="col-5"> <h6 className="text-end">  {customer.paymentmethod} </h6></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row mb-4">
                                            <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6 bg-warning ms-auto">
                                                <div className="row p-2 text-white text-center custom-totalamount">
                                                    <div className="col-4"> <h6 className="custom-totalamount"> Total : </h6></div>
                                                    <div className="col-8"> <h6 className="text-end custom-totalamount"><i className="fa-solid fa-indian-rupee-sign me-1"></i>  {customer.totalamount} </h6></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            
                            <div class="modal-footer">
                                <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
                            </div>

                            </div>
                        </div>
                    </div>


                </div>
            </div>
        )
    }
    else
    {
        return(
            <div className="container">
                <div className="row mt-4 h-200">
                    <div className="col-sm-8 col-md-8 col-lg-8 col-xl-8 col-xxl-8 m-auto">
                        <h1 className="text-center mb-3"> <i className="fa fa-shopping-bag text-warning"></i> Your Cartlist is Empty  </h1>
                        <h3 className="text-center mb-3"> Please Select the product and Add to Cart here ! ....  </h3>
                    </div>
                </div>
            </div>
        )
    }
}

export default Cartlist;
