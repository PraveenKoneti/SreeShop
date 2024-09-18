import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import swal from "sweetalert";
import { fetchData, postData } from "../Api/apihandler";
import { config } from "../config";


const Myorders = () =>
{
    let[allorderlist, updateorderlist] = useState( [] );


    const ordercancel = async (id) =>{
        await postData(config.cancelorder, {id:id})
        .then(res=>{
            swal("Order Successfully Cancelled","","success")
            .then(res=>{
                getorderlist();
            })
        })
    }

    const getorderlist = async() =>
    {
        if(localStorage.getItem("userid") != null)
        {
            let response = await fetchData(`${config.getorderlist}?id=${localStorage.getItem("userid")}`)
            updateorderlist( response.reverse() );
        }
        else
            swal("Please Login / Signup","You have Account Login / Signup","warning").then(res=>{})
    }

    useEffect(()=>{getorderlist();}, []);




    if(localStorage.getItem("userid") === null)
        return <Navigate to="/SreeShop/userlogin" />


    return(
        <div className="container">
            <div className="row mt-5">
                <h1 className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xxl-12 text-center text-primary text-decoration-underline mb-4"> {allorderlist.length} : Orders in Orderlist </h1>
                {
                    allorderlist.map((orders, index1)=>{
                        return(
                            <div className="row mb-2 pt-4 pb-4 m-auto" key={index1}>
                                <div className="col-xl-10 col-lg-10 col-md-10 col-sm-10 col-xxl-10 p-4 m-auto shadow-lg">
                                    <div className="row">
                                        <h2 className=" col-sm-8 text-center text-warning mb-3 text-decoration-underline"> {orders.products.length} : Items in this Order </h2>
                                        {
                                            orders.orderstatus === "ordered" ? 
                                            (<h2 className="col-sm-4 text-end"> <button onClick={ordercancel.bind(this, orders._id)} className="btn btn-danger btn-sm"> Cancel Order </button> </h2>)
                                            :
                                            (<h5 className="text-danger text-center col-sm-4"> <b> Order Cancelled !.... </b> </h5>)
                                        }
                                    </div>
                                    <table className="m-auto table table-bordered text-center table-sm table-md table-lg table-xl mt-2">
                                        <thead>
                                            <tr>
                                                <th className="bg-primary pt-2 pb-2 text-white"> Product  </th>
                                                <th className="bg-primary  pt-2 pb-2 text-white"> Name  </th>                                           
                                                <th className="bg-primary  pt-2 pb-2  text-white"> Price  </th>
                                                <th className="bg-primary  pt-2 pb-2  text-white"> Qty  </th>
                                                <th className="bg-primary  pt-2 pb-2 text-white"> Total  </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {
                                                orders.products.map((items, index2)=>{
                                                    return(
                                                        <tr key={index2}>
                                                            <td> <img src={`${config.host}/productimages/${items.productimage}`} width="60%" height="80" className="orderimg" /> </td>
                                                            <td className="text-start"> {items.productname} </td>
                                                            <td> {items.productprice} </td>
                                                            <td> {items.productquantity} </td>
                                                            <td> {items.productquantity * items.productprice} </td>  
                                                        </tr>
                                                    )
                                                })
                                            }

                                            <tr>
                                                <th colspan={1}></th>
                                                <th className=" bg-black text-white"> Ordered On  </th>
                                                <td colspan={3} className="text-start ps-4 bg-black text-white"> <b>  {orders.date} </b> </td>
                                            </tr>

                                            <tr>
                                                <th colspan={1}></th>
                                                <th className=" bg-warning text-white"> Grand Total </th>
                                                <td colspan={3} className="text-start ps-4 bg-warning text-white"> <b> <i class="fa-solid fa-indian-rupee-sign me-1"></i> {orders.totalamount} </b> </td>
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



const login = () =>
{
    localStorage.setItem("userlogin", "true");
    window.location.reload();
}