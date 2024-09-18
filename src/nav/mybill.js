import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Navigate } from "react-router-dom";
import swal from "sweetalert";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import moment from 'moment';

const Mybill = () => {
    const [ordered, setOrdered] = useState(false);
    const [orderId, setOrderId] = useState("");
    const location = useLocation();
    const { customer } = location.state || {};
    const [currentDate, setCurrentDate] = useState("");

    useEffect(() => {
        getCurrentDate();
    }, []);

    const getCurrentDate = () => {
        const date = moment().format('MMMM Do YYYY, h:mm:ss a');
        setCurrentDate(date);
    }

    const order = async () => {
        customer["date"] = currentDate;
        const url = "http://localhost:7777/orderlist/saveorder";

        let customers = customer;
        customers["id"] = localStorage.getItem("userid");
        const postData = {
            headers: { 'Content-Type': 'application/json' },
            method: "post",
            body: JSON.stringify(customers)
        };

        try {
            const response = await fetch(url, postData);
            const orderinfo = await response.json();
            setOrderId(orderinfo.orderId);
            swal("Order Placed Successfully", "", "success").then(res=>{generateAndSendPDF(orderinfo.orderId)})
        } catch (error) {
            console.error("Error placing order:", error);
            swal("Error", "Failed to place order", "error");
        }
    };

    const generateAndSendPDF = (orderId) => {
        const input = document.getElementById("mybill");
        const margin = 10; // Margin value in mm
        alert("hi");
        html2canvas(input, { scale: 2 })
            .then((canvas) => {
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
                sendEmail(pdfBlob, orderId);
            })
            .catch((error) => {
                console.error("Error generating PDF:", error);
            });
    };

    const sendEmail = async (pdfBlob, orderId) => {
        alert("hi");
        const formData = new FormData();
        formData.append("pdf", pdfBlob, "SreeShop Order.pdf");
        formData.append("toemail", customer.email);
        formData.append("mysubject", "Your SreeShop Order Confirmation");
        formData.append("mymessage", `
            Dear ${customer.name},

            Thank you for shopping with SreeShop! Your order has been successfully placed and is now being processed.

            Below are the details of your order: 

            Order ID: ${orderId}

            Name: ${customer.name} 
            Mobile:     ${customer.mobile} 
            Email:  ${customer.email} 
            Address:    ${customer.address}
            Total Amount:  ${customer.totalamount} 
            Payment Method:  ${customer.paymentmethod}
            Date:       ${customer.date} 

            Thank you for your purchase!
        `);

        try {
            const response = await fetch("http://localhost:7777/emailpdf/sendemailpdf", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            if (data.message === "Email Sent Successfully!") {
                swal("Email Sent Successfully", "", "success").then(() => {
                    setOrdered(true);
                });
            } else {
                swal("Error Sending Email", "", "error");
            }
        } catch (error) {
            console.error("Error sending email:", error);
            swal("Error Sending Email", "", "error");
        }
    };

    if (ordered) {
        return <Navigate to="/SreeShop/myorders" />;
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-12 text-center mt-4">
                    <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#myModal" onClick={order}>Proceed</button>
                </div>
            </div>
            <div class="modal" id="myModal">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">

                    <div class="modal-header">
                        <h4 class="modal-title">Modal Heading</h4>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>

                    <div class="modal-body">
                        <div className="row mt-4" id="mybill">
                            <div className="m-auto pt-3 shadow-lg">
                                <div className="container ps-3 pe-3 mb-4 fs-1"> <i className="fa-brands fa-SreeShop text-warning"></i>SreeShop</div>

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
                                                        customer.itemslist.map((product, index) => {
                                                            return (
                                                                <tr key={index}>
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
                                        <div className="row p-2  text-white text-center">
                                            <div className="col-4"> <h6> Total : </h6></div>
                                            <div className="col-8"> <h6 className="text-end"><i className="fa-solid fa-indian-rupee-sign me-1"></i>  {customer.totalamount} </h6></div>
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
    );
}

export default Mybill;
