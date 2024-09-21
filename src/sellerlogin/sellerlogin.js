
import { useState, useEffect } from "react";
import swal from "sweetalert";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { postData } from "../Api/apihandler";
import { config } from "../config";


const Sellerlogin = () =>
{
    const [loggedIn, setLoggedIn] = useState(false);
    let[useremail, pickuseremail] = useState("");
    let[userpassword, pickuserpassword] = useState("");



    const homepage = () =>
    {
        localStorage.setItem("SreeShoppermit", "sellerlogout");
        window.close();
    }


    const login = async() =>
    {
        if(useremail == "" || userpassword == "")
            swal("Enter Details","Correctly","warning");
        else
        {
            let usercheck = {email:useremail, password:userpassword};
            await postData(config.sellerlogin, usercheck)
            .then(sellerinfo=>{   
                if(sellerinfo.status)
                {
                    localStorage.setItem("sellerid", sellerinfo.existingUser._id);
                    localStorage.setItem("sellername", sellerinfo.existingUser.firstname);
                    localStorage.setItem("sellertoken", sellerinfo.token);
                    swal("Login Successfull", "Credentials are Matched Successfully", "success")
                    .then(() => {
                        setLoggedIn(true);
                        window.location.reload();    // Reload the page
                    });
                }
                else 
                    swal("Invalid Credentials", "Please check your email and password", "warning");
            })
            pickuseremail("");
            pickuserpassword("");
        }
    }


    if (loggedIn)
        return <Navigate to="/dashboard" />;


    return(
            <div className="container">
                <div className="row mt-5 mb-4">
                    <div className="col-lg-4 col-sm-4 col-md-4 col-xl-4 col-xl-4"></div>
                    <div className="col-lg-4 col-sm-4 col-md-4 col-xl-4 col-xl-4 mt-5">
                        <div className="card border-0 shadow-lg">
                            <h1 className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xxl-12  text-center mb-4 mt-4"><i className="fa fa-shopping-bag text-warning"></i> SreeShop</h1>
                            <div className="card-header text-center text-primary bg-white border-0"> <h3> <i className="fa fa-user me-1"></i> Seller Login </h3> </div>

                            <div className="card-body">
                                <div className="input-group mb-3">
                                    <span className="input-group-text justify-content-center col-2 border-2 border-black border-start-0 border-end-0 border-top-0 text-danger rounded-0">  <i className="fa fa-envelope"></i>  </span>
                                    <input type="email" className="form-control border-2 border-black border-start-0 border-end-0 border-top-0 rounded-0 shadow-none" placeholder="Enter Email" onChange={obj=>pickuseremail(obj.target.value)} value={useremail} />
                                </div>

                                <div className="input-group">
                                    <span className="input-group-text justify-content-center col-2 border-2 border-black border-start-0 border-end-0 border-top-0 rounded-0">  <i className="fa fa-lock"></i>  </span>
                                    <input type="password" className="form-control border-2 border-black border-start-0 border-end-0 border-top-0 rounded-0 shadow-none" placeholder="Enter Password" onChange={obj=>pickuserpassword(obj.target.value)} value={userpassword} />
                                </div>
                            </div>

                            <div className="card-footer text-center bg-white border-0">
                                    
                                <button className="btn btn-primary text-center m-auto mt-2 mb-3" onClick={login}> Login  <i className="fa fa-arrow-right"></i> </button>
                                <p className="text-center"> Or </p>
                                <p className="text-center"> Create New Account ? <Link to="/sellersignup"> <b className="text-primary ms-2"> Signup </b> </Link> </p>

                                <div className="container mb-3 mt-2">
                                    <div className="col-lg-12 text-primary text-decoration-underline"> <h5 onClick={homepage}> <i class="fa-solid fa-angle-left"></i> Home page </h5> </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-sm-4 col-md-4 col-xl-4 col-xl-4"></div>
                </div>

            </div>
    )
}

export default Sellerlogin;