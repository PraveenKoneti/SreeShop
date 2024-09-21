import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import swal from "sweetalert";
import { fetchData, postData } from "../Api/apihandler";
import { config } from "../config";

const Myorders = () => {
    let [allorderlist, updateorderlist] = useState([]);
    let [expandedOrder, setExpandedOrder] = useState(null); // State for expanded order

    const ordercancel = async (id) => {
        await postData(config.cancelorder, { id: id })
            .then(res => {
                swal("Order Successfully Cancelled", "", "success")
                    .then(res => {
                        getorderlist();
                    });
            });
    };

    const getorderlist = async () => {
        if (localStorage.getItem("userid") != null) {
            let response = await fetchData(`${config.getorderlist}?id=${localStorage.getItem("userid")}`);
            updateorderlist(response.reverse());
        } else {
            swal("Please Login / Signup", "You have Account Login / Signup", "warning").then(res => { });
        }
    };

    useEffect(() => { getorderlist(); }, []);

    if (localStorage.getItem("userid") === null)
        return <Navigate to="/userlogin" />;

    return (
        <div className="container">
            <div className="row mt-5">
                <h1 className="col-xl-12 text-center text-primary text-decoration-underline mb-4">
                    {allorderlist.length} : Orders in Orderlist
                </h1>
                {
                    allorderlist.map((orders, index1) => {
                        const orderDate = new Date(orders.date);
                        const processingDate = new Date(orderDate);
                        processingDate.setDate(processingDate.getDate() + 2); // Add 2 days for processing

                        const shippedDate = new Date(processingDate);
                        shippedDate.setDate(shippedDate.getDate() + 2); // Add 2 days for shipping

                        const deliveryDate = new Date(shippedDate);
                        deliveryDate.setDate(deliveryDate.getDate() + 2); // Add 2 days for delivery

                        const events = [
                            { status: 'Ordered', date: orderDate.toLocaleDateString(), icon: 'pi pi-shopping-cart', color: '#9C27B0' },
                            { status: 'Processing', date: processingDate.toLocaleDateString(), icon: 'pi pi-cog', color: '#673AB7' },
                            { status: 'Shipped', date: shippedDate.toLocaleDateString(), icon: 'pi pi-shopping-cart', color: '#FF9800' },
                            { status: 'Delivered', date: deliveryDate.toLocaleDateString(), icon: 'pi pi-check', color: '#607D8B' }
                        ];

                        const horizontalTimelineStyle = {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        };

                        return (
                            <div className="row mb-2 pt-4 pb-4 m-auto" key={index1}>
                                <div className="col-xl-10 p-4 m-auto shadow-lg">
                                    <div className="row">
                                        <h2 className="col-sm-8 text-center text-warning mb-3 text-decoration-underline">
                                            {orders.products.length} : Items in this Order
                                        </h2>
                                        {
                                            orders.orderstatus === "ordered" ? (
                                                <h2 className="col-sm-4 text-end">
                                                    <button onClick={ordercancel.bind(this, orders._id)} className="btn btn-danger btn-sm"> Cancel Order </button>
                                                    <button onClick={() => setExpandedOrder(expandedOrder === index1 ? null : index1)} className="btn btn-primary btn-sm ms-2"> More Details </button>
                                                </h2>
                                            ) : (
                                                <h5 className="text-danger text-center col-sm-4"> <b> Order Cancelled !.... </b> </h5>
                                            )
                                        }
                                    </div>

                                    {expandedOrder === index1 && (
                                        <div className="mb-3">
                                            <div style={horizontalTimelineStyle}>
                                                {events.map((event, idx) => (
                                                    <div key={idx} style={{ flex: 1, textAlign: 'center' }}>
                                                        <i className={event.icon} style={{ color: event.color }}></i>
                                                        <h4>{event.status}</h4>
                                                        <p>{event.date}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <table className="m-auto table table-bordered text-center table-sm table-md table-lg table-xl mt-2">
                                        <thead>
                                            <tr>
                                                <th className="bg-primary pt-2 pb-2 text-white"> Product </th>
                                                <th className="bg-primary pt-2 pb-2 text-white"> Name </th>
                                                <th className="bg-primary pt-2 pb-2 text-white"> Price </th>
                                                <th className="bg-primary pt-2 pb-2 text-white"> Qty </th>
                                                <th className="bg-primary pt-2 pb-2 text-white"> Total </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {
                                                orders.products.map((items, index2) => {
                                                    return (
                                                        <tr key={index2}>
                                                            <td> <img src={`${config.host}/productimages/${items.productimage}`} width="60%" height="80" className="orderimg" alt="" /> </td>
                                                            <td className="text-start"> {items.productname} </td>
                                                            <td> {items.productprice} </td>
                                                            <td> {items.productquantity} </td>
                                                            <td> {items.productquantity * items.productprice} </td>
                                                        </tr>
                                                    )
                                                })
                                            }

                                            <tr>
                                                <th colSpan={1}></th>
                                                <th className="bg-black text-white"> Ordered On </th>
                                                <td colSpan={3} className="text-start ps-4 bg-black text-white"> <b> {orders.date} </b> </td>
                                            </tr>

                                            <tr>
                                                <th colSpan={1}></th>
                                                <th className="bg-warning text-white"> Grand Total </th>
                                                <td colSpan={3} className="text-start ps-4 bg-warning text-white"> <b> <i className="fa-solid fa-indian-rupee-sign me-1"></i> {orders.totalamount} </b> </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Myorders;
