
import swal from "sweetalert";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { deleteData, fetchData, postData } from "../Api/apihandler";
import { config } from "../config";


const Mywishlist = () =>
{

    let[checkcart, updatecart] = useState( false );


    const deletewishlist = async(product) =>
    {
        await deleteData(`${config.deletewishlist}/${product._id}`)
        .then(msg=>{
            swal(msg.message,'',"success")
            .then(()=>{
                getwishlist();
            })
        })
    }




    let check = false;
    const addcart = async(product) =>
    {
        if(product.productactive === 'In Stock')
        {
            let newcartdata = {
                userid              :  localStorage.getItem("userid"),
                productid           :  product.productid,
                brandname           :  product.brandname,
                sellerid            :  product.sellerid,
                categoryname        :  product.categoryname,
                productname         :  product.productname,          
                productprice        :  product.productprice,
                productquantity     :  1,
                productactive       :  product.productactive,
                productimage        :  product.productimage
            }
            await postData(config.savecartlist, newcartdata)
            .then(msg=>{
                if(msg.message === "yes")
                {
                    swal("Added to Cart Succesfully","","success")
                    .then(()=>{
                        getwishlist();
                    })  
                }
                else
                    swal("This Product Already Existed in Cart","","warning");
            })
        }
        else 
            swal("Out Of Stock","Product out of stock, buy after sometime","warning");
    }



                    //  RETRIVING THE WISHLIST DATA FROM BACKEND

    let[wishlist, updatewishlist] = useState( [] );
    const getwishlist = async() =>
    {
        if(localStorage.getItem("userid") != null)
        {
            await fetchData(`${config.getwishlist}?id=${localStorage.getItem("userid")}`)
            .then(wishlistarray=>{
                updatewishlist( wishlistarray );
            })
        }
        else
        {
            swal("Please Login / Signup","You have Account Login / Signup","warning")
            .then(()=>{
                login();
            })
        }

    }

    useEffect(()=>{getwishlist();}, []);




    
    if(checkcart == true)
        return <Navigate to="/SreeShop/cartlist" />


    if(wishlist.length > 0)
    {
        return(
            <div className="container">
                <div className="row mt-4">
                    <h1 className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xxl-12 text-center text-primary text-decoration-underline mb-3">  Products in Wishlist </h1>
                    {
                        wishlist.map((wishlistproducts, index1)=>{
                            return(
                                <div className="row p-1 m-0  pt-4" key={index1}>

                                    <div className="col-xl-10 col-lg-10 col-md-10 col-sm-9 col-xxl-10 pt-4 pb-3 m-auto p-0 shadow-lg">
                                        <div className="row p-0 m-0">
                                            <div className="col-2"> <img src={`${config.host}/productimages/${ wishlistproducts.productimage}`} width="100%" height="140" className="custom-imgwishlist" /> </div>
                                            <div className="col-4 m-auto"> <h5> {wishlistproducts.productname} </h5> </div> 
                                            <div className="col-6 p-0 mt-0 m-auto">
                                                <p className="col-12 pe-3 text-end" onClick={deletewishlist.bind(this, wishlistproducts)}> <i className="fa-regular fa-circle-xmark fs-5 mb-2 text-danger"></i> </p>
                                                <div className="row p-0 m-0 m-auto">
                                                    <div className="col-4 m-auto text-center p-0"> <h5> Rs. {wishlistproducts.productprice}/__ </h5> </div> 
                                                    <div className="col-6 m-auto text-center p-0"> <button onClick={addcart.bind(this, wishlistproducts)} className="btn btn-warning form-control btn-wishlist"> Move Cart <i className="fa fa-arrow-right ms-1 text-white"></i> </button> </div> 
                                                </div>
                                            </div> 
                                        </div>
                                    
                                    </div>

                                </div>
                            )
                        })
                    }
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
                        <h1 className="text-center mb-3"> <i className="fa fa-heart text-warning"></i> Your Wishlist is Empty  </h1>
                        <h3 className="text-center mb-3"> Please Select the product and Add to Wishlist here ! ....  </h3>
                    </div>
                </div>
            </div>
        )
    }
}

export default Mywishlist;



const login = () =>
{
    localStorage.setItem("userlogin", "true");
    window.location.reload();
}