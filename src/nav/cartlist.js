import { useState, useEffect, useRef } from "react";
import swal from "sweetalert";
import { Navigate } from "react-router-dom";
import moment from "moment";
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import { deleteData, fetchData, postData, putData } from "../Api/apihandler";
import { config } from "../config";
import { Toast } from 'primereact/toast'; // Import Toast component
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const Cartlist = () =>
{
    const [ordered, setOrdered] = useState(false);
    const mybillpdf = useRef();
    const toastRef = useRef(null); // Create a ref for the toast
    const [showCustomerDetails, setShowCustomerDetails] = useState(false);

    const showToast = (severity, detail, isLoading = false,summary="",) => {
        const content = (
            <div className="d-flex align-items-center">
                <span>{detail}</span>
                {isLoading && (
                    <div className="loader-dots ms-2" > {/* Remove margin */}
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                )}
            </div>
        );
        
        toastRef.current.show({ severity, summary: summary, detail: content });
        
    };

    

            //  TO DELETET THE PARTICULAR PRODUCT FROM THE CARTLIST

    const deleteproduct = async(product) =>
    {
        toastRef.current.clear();
        showToast('info', 'Deleting Product from Cartlist', true); // Show loading toast
        await deleteData(`${config.deletecartlist}/${product._id}`)
        .then(response => {
            toastRef.current.clear();
            if(response && response.message !== "")
            {
                showToast("success","product Removed from Cartlist")
                setTimeout(() => {
                    toastRef.current.clear();
                    getdata();
                }, 2000);
            }
            else 
                showToast("error","Internal Server Error");
        })
    }


        //   TO UPDATE THE PARTICULAR PROUDCT QUANTITY IN CARTLIST

    const updateqty = async(product, status) =>
    {
        showToast('info', 'Updating Product Quantity', true); // Show loading toast
        if(status === "add")
        {
            if(product.productquantity <= 5)
                product["productquantity"] = product.productquantity + 1;
            else
                showToast("warn","The quantity is more than 5 and hasn't been taken",false,'Product Quantity Alert');
        }
        else
            product["productquantity"] = product.productquantity - 1;


        if(product.productquantity === 0)
            deleteproduct(product);
        else
        {
            if(product.productquantity <= 5)
            {
                await putData(`${config.updatecartlist}/${product._id}`, product)
                .then(response=>{
                    toastRef.current.clear();
                    if(response && response.message !== "")
                    {
                        showToast("success",response.message);
                        setTimeout(() => {
                            getdata();
        
                            if(status === "add" && selecteditems.length !== 0)
                                selectcartitem("true", product, "true");
                            else if(product.productquantity > 0 && selecteditems.length !== 0)
                                selectcartitem("false", product, "false");
                            else
                                amount[0].value = 0;
                        }, 1000);
                    }
                    else 
                        showToast("error","Internal Server Error");
                })
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


    let[customer, updatecustomer] = useState( { name: '', mobile: '', email: '', address: '', totalamount: 0, paymentmethod: '', itemslist: []} );
    

    const order = async () => {
        setShowCustomerDetails(false);
        showToast('info', 'Please wait, your order is being processed', true,'Processing Order'); // Show loading toast
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
        try {
            const element = mybillpdf.current;
    
            // Options for html2pdf
            const options = {
                margin: 1,
                filename: 'document.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
            };
    
            // Generate PDF as a Blob
            const pdfBlob = await html2pdf()
                .from(element)
                .set(options)
                .output('blob'); // Ensure to output as Blob
    
            // Check if pdfBlob is a Blob
            if (!(pdfBlob instanceof Blob)) {
                //console.error('Generated PDF is not a Blob');
                return;
            }
    
            // Create FormData and append the PDF Blob and other fields
            const formData = new FormData();
            formData.append('file', pdfBlob, 'SreeShop_Order.pdf'); // Add Blob to FormData
            formData.append("toemail", customer.email);
            formData.append("mysubject", "Your SreeShop Order Confirmation");
            formData.append("mymessage", `
                Dear ${customer.name},
                
                Thank you for shopping with SreeShop! Your order has been successfully placed and is now being processed.
                
                Below are the details of your order:
                
                Order ID: ${orderId}
                
                Name: ${customer.name}
                Mobile: ${customer.mobile}
                Email: ${customer.email}
                Address: ${customer.address}
                Total Amount: INR ${customer.totalamount}
                Payment Method: ${customer.paymentmethod}
                Date: ${customer.date}
                
                Thank you for your purchase!
            `);
                
            
    
            // Example: Log FormData entries
            console.log('FormData Entries:');
            formData.forEach((value, key) => {
                console.log(`${key}: ${value}`);
            });
    
            // Send the FormData to the server
            await axios.post(config.sendorderpdf, formData)
            .then(response => {
                if (response.data.message === "Email Sent Successfully!") {
                    toastRef.current.clear();
                    showToast("success","Ordered Successfully",)
                    setTimeout(() => {setOrdered(true);}, 3000);
                } else {
                    swal("Error Sending Email", "", "error");
                }
            } )
    
            
    
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
            showToast('info', 'Fetching products', true); // Show loading toast
            await fetchData(`${config.getcartlist}?id=${localStorage.getItem("userid")}`)
            .then(response => {
                if(response.status)
                {
                    pickcartlist( response.items );
                    toastRef.current.clear();  // Calling clear() after checking if ref is defined  
                }  
                else 
                {
                    toastRef.current.clear();
                    showToast('error',`Please Login ,${response.message}`)
                    setTimeout(() => {
                        pickloginin(true);
                    }, 1500);
                }
            })
           
        }
        else
        {
            showToast('error', 'Login is required to access your cart');
            setTimeout(() => {
                pickloginin(true);
            }, 1500);
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


    if(ordered === true)
        return <Navigate to="/myorders" />

    if(loginin === true)
        return <Navigate to="/home" /> 
    

    return(
        <div className="container-fluid">
            <Toast ref={toastRef} position="center" className="custom-toast" />{/* Include the Toast component */}
            <div className="row mt-4 me-0 ps-0 m-1 ">
                {
                    cartlist.length === 0 ? (
                        <div className="container">
                            <div className="row mt-4 h-200">
                                <div className="col-sm-8 col-md-8 col-lg-8 col-xl-8 col-xxl-8 m-auto">
                                    <h1 className="text-center mb-3"> <i className="fa fa-shopping-bag text-warning"></i> Your Cartlist is Empty  </h1>
                                    <h3 className="text-center mb-3"> Please Select the product and Add to Cart here ! ....  </h3>
                                </div>
                            </div>
                        </div>
                    )
                    :
                    (
                        <div className="row">
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
                                                    <p className="mb-2" style={{ color: cartproduct.productactive === "InStock" ? "green" : "red" }}>
                                                        <b>{cartproduct.productactive}</b>
                                                    </p>
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
                                            <div className="col-6 mt-4 fs-5 text-end"> <p> <b><i class="fa fa-indian-rupee-sign me-1"></i> {totalamount} </b> </p> </div>
                                        </div>

                                        <div className="row mb-2 m-0 p-0">
                                            <div className="col-6 fs-5"> <p> Discount </p> </div>
                                            <div className="col-6 fs-5 text-end"> <p> <b> - <i class="fa fa-indian-rupee-sign"></i> {discount} </b> </p> </div>
                                        </div>

                                        <div className="row mb-2 m-0 p-0">
                                            <div className="col-6 fs-5"> <p>Shipping Charges </p> </div>
                                            <div className="col-6 fs-5 text-end"> <p> <b className="text-decoration-line-through"><i class="fa fa-indian-rupee-sign"></i> 100 </b> <b className="text-success ms-2"> Free </b>  </p> </div>
                                        </div>

                                        <div className="row mb-2 m-0 p-0">
                                            <div className="col-6 fs-5"> <p>Processing Fee </p> </div>
                                            <div className="col-6 fs-5 text-end"> <p> <b className="text-decoration-line-through"><i class="fa fa-indian-rupee-sign"></i> 160 </b> <b className="ms-3"> <i class="fa fa-indian-rupee-sign"></i> 100 </b>  </p> </div>
                                        </div>

                                        <hr size={4} className="bg-dark" />
                                    </div>
                                    <div className="card-footer bg-black text-white pt-4 pb-4">
                                        <div className="row mb-4 m-0 p-0 bg-black">
                                            <div className="col-6 fs-5"> <p> <b> Amount Payable </b>  </p> </div>
                                            <div className="col-6 fs-5 text-end"> <p> <b> <i class="fa fa-indian-rupee-sign"></i> { (totalamount - discount ) + 100} </b> </p> </div>
                                        </div>

                                        <div className="row mb-2 m-0 p-0 bg-black">
                                            <button  className="btn btn-primary btn-md btn-sm btn-lg"  onClick={()=> setShowCustomerDetails(true)}> Buy Now </button>
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                        








                            {/* CUSTOMER DETAILS FIELDS */}


                        <Modal show={showCustomerDetails} onHide={()=>setShowCustomerDetails(false)} size="lg" centered>
                            <Modal.Header closeButton>
                                <Modal.Title className="text-center">Select Payment Method</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <h3 className="mb-2">Enter Customer Details</h3>
                                <Row>
                                <Col sm={5} className="m-auto mb-3">
                                    <input type="text" className="form-control" 
                                        onChange={obj=>pickcname(obj.target.value)} value={cname} placeholder="Enter Your Name"
                                        style={{ border:(cname === "")?(cnameerror === "false")?'4px solid red':'':'', boxShadow: (cname === "")?(cnameerror === "false")?'0px 0px 5px red':'':'' }}
                                    />
                                </Col>
                                <Col sm={5} className="m-auto mb-3">
                                    <input type="number" className="form-control" 
                                        onChange={obj=>pickcmobile(obj.target.value)} value={cmobile}  placeholder="Enter Your Mobile No"
                                        style={{ border:(cmobile === "")?(cmobileerror === "false")?'4px solid red':'':'', boxShadow: (cmobile === "")?(cmobileerror === "false")?'0px 0px 5px red':'':'' }}
                                    />
                                </Col>
                                <Col sm={5} className="ms-auto me-auto mb-3">
                                    <input type="email" className="form-control" 
                                        onChange={obj=>pickcemail(obj.target.value)} value={cemail} placeholder="Enter Your Email"
                                        style={{ border:(cemail === "")?(cemailerror === "false")?'4px solid red':'':'', boxShadow: (cemail === "")?(cemailerror === "false")?'0px 0px 5px red':'':'' }}    
                                    />
                                </Col>
                                <Col sm={5} className="m-auto mb-3">
                                    <textarea type="text" rows="2" className="form-control" placeholder="Enter the correct Address with Pincode" 
                                        onChange={obj=>pickcaddress(obj.target.value)} value={caddress}
                                        style={{ border:(caddress === "")?(caddresserror === "false")?'4px solid red':'':'', boxShadow: (caddress === "")?(caddresserror === "false")?'0px 0px 5px red':'':'' }}
                                    >    
                                    </textarea>
                                </Col>
                                </Row>
                                <Row>
                                <Col xs={8}>
                                    <h5>You are paying for 1 Order Request</h5>
                                </Col>
                                <Col xs={4} className="text-end">
                                    <h6>INR {totalamount - discount}</h6>
                                </Col>
                                </Row>
                                <Row className="bg-warning pt-2 pb-1 mb-3">
                                <Col xs={8} className="text-white">
                                    <h5>TOTAL AMOUNT TO BE PAID</h5>
                                </Col>
                                <Col xs={4} className="text-end text-white">
                                    <h6>INR {totalamount - discount}</h6>
                                </Col>
                                </Row>
                                <h4>PAYMENT METHOD</h4>
                                <Row className="mt-3">
                                <Col xs={12} sm={3} className="m-auto mt-2">
                                    <p
                                    className={`payment-option text-center shadow-lg p-1 pt-3 pb-3 ${
                                        selectedpaymentmethod === "Phone Pay" ? "bg-black text-white" : ""
                                    }`}
                                    onClick={() => handlePaymentMethodSelect("Phone Pay")}
                                    >
                                    <i className="pi pi-phone" style={{ fontSize: "2rem", color: "purple" }}></i>
                                    <br />
                                    <b className="fs-5" style={{ color: "purple" }}>Phone Pay</b>
                                    </p>
                                </Col>
                                <Col xs={12} sm={3} className="m-auto mt-2">
                                    <p
                                    className={`payment-option text-center shadow-lg p-1 pt-3 pb-3 ${
                                        selectedpaymentmethod === "G Pay" ? "bg-black text-white" : ""
                                    }`}
                                    onClick={() => handlePaymentMethodSelect("G Pay")}
                                    >
                                    <i className="fa-brands fa-google-pay" style={{ fontSize: "2rem", color: "#4285F4" }}></i>
                                    <br />
                                    <b className="fs-5" style={{ color: "#4285F4" }}>G Pay</b>
                                    </p>
                                </Col>
                                <Col xs={12} sm={3} className="m-auto mt-2">
                                    <p
                                    className={`payment-option text-center shadow-lg p-1 pt-3 pb-3 ${
                                        selectedpaymentmethod === "Paytm" ? "bg-black text-white" : ""
                                    }`}
                                    onClick={() => handlePaymentMethodSelect("Paytm")}
                                    >
                                    <i className="pi pi-wallet" style={{ fontSize: "2rem", color: "#003F6C" }}></i>
                                    <br />
                                    <b className="fs-5" style={{ color: "#003F6C" }}>Paytm</b>
                                    </p>
                                </Col>
                                </Row>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button className="btn btn-sm m-auto" variant="success" onClick={handlepaymentsubmit}>Pay Now</Button>
                            </Modal.Footer>
                            </Modal>










                                {/* ORDER PDF MODAL  */}


                            <div className="modal" id="myModal2">
                                <div className="modal-dialog modal-lg">
                                    <div className="modal-content">

                                    <div className="modal-header">
                                        <h4 className="modal-title"> Order Details </h4>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                                    </div>

                                    <div class="modal-body">
                                        <div className="row mt-4" id="mybill" ref={mybillpdf}>
                                            <div className="m-auto pt-3 shadow-lg">
                                                <div className="container ps-3 pe-3 mb-4 fs-1"> <img src="/sreeshop.jpg" width='50' height='50' alt="" /> SreeShop</div>

                                                <div className="row mb-4">
                                                    <div className="col-7  bg-warning"> </div>
                                                    <div className="col-3 m-0 p-0 text-center"> <p className=" m-0 p-0 fs-5"> INVOICE </p></div>
                                                    <div className="col-2 bg-warning"> </div>
                                                </div>

                                                <div className="container ps-3 pe-3 m-auto mb-3">
                                                    <div className="row">
                                                        <div className="me-auto">
                                                            <h2 className="mb-3"> Invoice to : </h2>
                                                            <h6> Name   : {customer.name} </h6>
                                                            <h6> Mobile : {customer.mobile} </h6>
                                                            <h6> Email  : {customer.email} </h6>
                                                            <h6 className="custom-date"> Address : {customer.address} </h6>
                                                            <h6 className="custom-date"> Date : {currentDate} </h6>
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
                                                            <p className="fs-6"> Returns follow SreeShop's policy, which may include fees or exclusions.</p>
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
                    )
                }

            </div>
        </div>
    )
}

export default Cartlist;
