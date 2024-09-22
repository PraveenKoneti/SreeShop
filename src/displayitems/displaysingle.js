
import { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import swal from "sweetalert";
import { deleteData, fetchData, postData } from "../Api/apihandler";
import { config } from "../config";

const Displaysingle = () =>
{
        let{category, id} = useParams();
        let[product, pickproduct] = useState({});

        //  CHECKING CART THAT PARTICULAR PRODUCT IS THER OR NOT ?

        const addcart = async(product, buy="") =>
        {
            if(localStorage.getItem("userid") != null)
            {
                let newcartdata = {
                    userid              :  localStorage.getItem("userid"),
                    productid           :  product._id,
                    sellerid            :  product.sellerid,
                    brandname           :  product.brandname,
                    categoryname        :  product.categoryname,
                    productname         :  product.productname,          
                    productprice        :  product.productprice,
                    productquantity     :  1,
                    productactive       :  product.productactive,
                    productimage        :  product.productimage
                }
                let response = await postData(config.savecartlist, newcartdata)
                if (response.message === "yes") 
                {
                    if(buy !=="")
                        pickgocart(true);
                    else
                    {
                        swal("Added to Cart Succesfully","","success")
                        .then(()=>{
                            getdata();
                        })  
                    }   
                }
                else
                {
                    if(buy === "buynow")
                        pickgocart(true);
                    else
                        swal("This Product Already Existed in Cart","","warning");
                }
            }
            else
            {
                swal("Please Login / Signup","You have Account Login / Signup","warning")
                .then(()=>{
                    login();
                })
            }
        }




        //   THAT PARTICULAR PRODUCT SHOULD BE ADDED TO WISHLIST

        const addwishlist = async(product, status, wishlistdata="") =>
        {
            if(localStorage.getItem("userid") != null)
            {
                if(status === "add" )
                { 
                    let newwishlist = {
                        userid              :  localStorage.getItem("userid"),
                        productid           :  product._id,
                        brandname           :  product.brandname,
                        sellerid            :  product.sellerid,
                        categoryname        :  product.categoryname,
                        productname         :  product.productname,          
                        productprice        :  product.productprice,
                        productactive       :  product.productactive,
                        productimage        :  product.productimage
                    }
                    let messageinfo = await postData(config.savewishlist, newwishlist)
                    if(messageinfo && messageinfo.message !== "")
                    {
                        swal(messageinfo.message,"","success")
                        .then(()=>{
                            getdata();
                        })
                    }
                    else 
                        swal("Internal Server Error",'',"warning");
                }
                else
                {
                    console.log("\n products _____",product,"\n wishlist data ____", wishlistdata)
                    let response = await deleteData(`${config.deletewishlist}/${wishlistdata._id}`)
                    if(response && response.message !== "")
                    {
                        swal(response.message,"","success")
                        .then(()=>{
                            getdata();
                        })
                    }
                    else 
                        swal("Internal Server Error",'',"warning");
                }
            }
            else
            {
                swal("Please Login / Signup","You have Account Login / Signup","warning")
                .then(()=>{
                    login();
                })
            }
        }

    
        
        // RETRVING THAT PARTICULAR PRODUCT THAT STORED IN PICKITEMS

        const getdata = async() =>
        {
            let response = await fetchData(`${config.getoneproduct}?producturl=${id}&userid=${localStorage.getItem("userid")}`)
            pickproduct( response )
        }
        

        useEffect(()=>{getdata();}, [category]);

        let[gocart, pickgocart] = useState(false)

        if(gocart === true)
            return <Navigate to="/cartlist" />

        return(
            <div className="container">
                <div className="row mt-2">
                    <div className="row pt-4 pb-4 shadow-lg"> 
                        <div className="col-xl-5 col-xxl-5 col-lg-5 col-md-5 col-sm-5 pb-3 m-auto shadow-lg text-center">
                            <div className="row ps-2 pt-2">
                                { product.wishlistId !== '' ?
                                    (<i className="fa-solid fa-heart text-danger text-start"
                                            onClick={addwishlist.bind(this, product, "delete", product.wishlistId )} >                                                                 
                                    </i>)
                                    :
                                    (<i className="fa-regular fa-heart text-start" onClick={addwishlist.bind(this, product, "add")}></i>)
                                }      
                            </div>
                            <img src={`${config.host}/productimages/${product.productimage}`} alt="" style={{ width: '75%', height: '450px' }} className="custom-imgsingle"/>
                        </div>
                        <div className="col-xl-6 col-xxl-6 col-lg-6 col-md-6 col-sm-6 ms-auto me-auto p-3 shadow-lg displaysingle">
                            <h3 className="valign-top mb-4 pt-1 text-primary"> {product.productname} </h3>
                            <h3 className="mb-4 text-center"> Rs. {product.productprice} /__ </h3>
                            <h6 className="mb-5 ps-3 pe-3"> <b className="text-decoration-underline text-danger me-3">PRODUCT DETAILS :  </b> {product.productdescription} </h6>
                            <div className="row">
                                <div className="col-5 mb-4 m-auto"> <button className="btn btn-warning form-control btn-displaysingle " onClick={addcart.bind(this, product)} > <i className="fa fa-shopping-cart me-1"></i> Add to Cart </button></div>
                                <div className="col-5 mb-4 m-auto"> <button className="btn form-control text-white btn-displaysingle" onClick={addcart.bind(this, product, "buynow")} style={{ backgroundColor: 'orangered' }}> <i className="fa fa-bag-shopping me-1"></i> Buy now</button> </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
}

export default Displaysingle;




const login = () =>
    {
        localStorage.setItem("userlogin", "true");
        window.location.reload();
    }
    