import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import swal from "sweetalert";
import { config } from "../config";
import { fetchData } from "../Api/apihandler";


const Myorderlist = () =>
{
    let[allorderlist, updateorderlist] = useState( [] );

    const getorderlist = async() =>
    {
        await fetchData(`${config.getsellerorders}?sellerid=${localStorage.getItem("sellerid")}`)
        .then(orderArray=>{
            console.log(orderArray);
            updateorderlist( orderArray.reverse() );
        })
    }

    useEffect(()=>{getorderlist();}, []);




    return(
        <div className="container">
            <div className="row p-0 m-0 mt-5">
                <h1 className="col-xl-12 col-lg-12 col-md-12 col-sm-12 text-center text-primary text-decoration-underline mb-4"> {allorderlist.length} : Orders in Orderlist </h1>
                {
                    allorderlist.map((orders, index1)=>{
                        return(
                            <div className="row mb-5 m-auto pt-3 pb-3 shadow-lg" key={index1}>
                                <div className="col-sm-4 col-md-4 col-lg-4 col-xl-4 col-xxl-4 mt-3">
                                    <div className="card border-0 m-auto shadow-lg"> 
                                        <div className="card-header bg-primary text-white text-center text-decoration-underline"> <h4> Customer Details </h4> </div>
                                        <div className="card-body"> 
                                            <p> <b className="text-decoration-underline me-2"> Name : </b>  {orders.name} </p>
                                            <p> <b className="text-decoration-underline me-2"> Mobile : </b>  {orders.mobile} </p>
                                            <p> <b className="text-decoration-underline me-2"> Email : </b>  {orders.email} </p>
                                            <p> <b className="text-decoration-underline me-2"> Address : </b>  {orders.address} </p>
                                        </div>
                                    </div> 
                                </div>

                                <div className="col-sm-8 col-md-8 col-lg-8 col-xl-8 col-xxl-8 p-2 m-auto mt-3 shadow-lg">
                                    <h6 className="text-end"> Date : {orders.date} </h6>
                                    <h2 className="text-center text-warning mb-3 text-decoration-underline"> {orders.products.length} : Items in this Order </h2>
                                    <table className="m-auto table table-bordered text-center table-sm table-md table-lg table-xl table-responsive">
                                        <thead>
                                            <tr>
                                                <th> Image  </th>
                                                <th> Name  </th>                                           
                                                <th> Price  </th>
                                                <th> Qty  </th>
                                                <th> Total  </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {
                                                orders.products.map((items, index2)=>{
                                                    if(items.sellerid === localStorage.getItem('sellerid'))
                                                    return(
                                                        <tr key={index2}>
                                                            <td> <img src={`${config.host}/productimages/${items.productimage}`} width="50%" height="80" className="sellerorder"  /> </td>
                                                            <td className="text-start"> {items.productname} </td>
                                                            <td> {items.productprice} </td>
                                                            <td> {items.productquantity} </td>
                                                            <td> {items.productquantity * items.productprice} </td>
                                                        </tr>
                                                    )
                                                })
                                            }
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

export default Myorderlist;