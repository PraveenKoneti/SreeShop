
import { useState, useEffect, useRef } from "react";
import { Navigate, useParams } from "react-router-dom";
import swal from "sweetalert";
import { deleteData, fetchData, postData } from "../Api/apihandler";
import { config } from "../config";
import { Toast } from 'primereact/toast'; // Import Toast component


const Displaysingle = () =>
{
        let{category, id} = useParams();
        let[product, pickproduct] = useState({});
        let [islogin, setislogin] = useState(true);
        

        const toastRef = useRef(null); // Create a ref for the toast

        const showToast = (severity, detail, isLoading = false, summary) => {
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
        
        





        //  CHECKING CART THAT PARTICULAR PRODUCT IS THER OR NOT ?

        const addcart = async(product, buy="") =>
        {
            if(localStorage.getItem("userid") != null)
            {
                if(product.productactive === 'InStock')
                {
                    showToast('info','Adding Product in Cartlist', true); // Show loading toast
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
                    await postData(config.savecartlist, newcartdata)
                    .then(response => {
                        toastRef.current.clear(); 
                        if (response.message === "yes") 
                        {
                            if(buy !=="")
                                pickgocart(true);
                            else
                            {
                                showToast("success","Added to Cart Succesfully")
                                setTimeout(() => {
                                    getdata();
                                }, 1500);
                            }   
                        }
                        else
                        {
                            if(buy === "buynow")
                                pickgocart(true);
                            else
                                showToast("warn","This Product Already Existed in Cart");
                        }
                    })
                }
                else 
                    showToast("warn", "Product out of stock, buy after some time",false,"Out Of Stock");
            }
            else
                showToast("warn","If You have Account Please Login",false,"Please Login / Signup",)
        }




        //   THAT PARTICULAR PRODUCT SHOULD BE ADDED TO WISHLIST

        const addwishlist = async(product, status, wishlistId="") =>
        {
            if(localStorage.getItem("userid") != null)
            {
                if(status === "add" )
                { 
                    showToast('info','Adding Product in Wishlist', true); // Show loading toast
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
                    await postData(config.savewishlist, newwishlist)
                    .then(messageinfo => {
                        toastRef.current.clear(); 
                        if(messageinfo && messageinfo.message !== "")
                        {
                            showToast("success",messageinfo.message);
                            setTimeout(() => {
                                toastRef.current.clear(); 
                                getdata();
                            }, 1500);
                        }
                        else 
                            showToast("warn","Internal Server Error");
                    })
                }
                else
                {
                    showToast('info', 'Deleting Product from Wishlist', true); // Show loading toast
                    await deleteData(`${config.deletewishlist}/${wishlistId}`)
                    .then(response => {
                        toastRef.current.clear(); 
                        if(response && response.message !== "")
                        {
                            showToast("success",response.message)
                            setTimeout(() => {
                                toastRef.current.clear(); 
                                getdata();
                            }, 1500);
                        }
                        else 
                            showToast("warn","Internal Server Error");
                    })
                } 
            }
            else
                swal("warn","You have Account Login / Signup",false,"Please Login / Signup")
                
        }

    
        
        // RETRVING THAT PARTICULAR PRODUCT THAT STORED IN PICKITEMS

        const getdata = async() =>
        {
            showToast('info', 'Fetching product', true); // Show loading toast
            await fetchData(`${config.getoneproduct}?producturl=${id}&userid=${localStorage.getItem("userid")}`)
            .then(response => {
                pickproduct( response )
                toastRef.current.clear(); 
            })  
        }
        

        useEffect(()=>{getdata();}, [category]);

        let[gocart, pickgocart] = useState(false)

        if(gocart === true)
            return <Navigate to="/cartlist" />


        return(
            <div className="container">
                <Toast ref={toastRef} position="center" className="custom-toast" /> {/* Include the Toast component */}
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
    