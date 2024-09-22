
import { useState, useEffect } from "react";
import swal from "sweetalert";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";

import { login } from "../Api/apihandler";
import { config } from "../config";

const Userlogin = () =>
{
    const [loggedIn, setLoggedIn] = useState(false);
    let[useremail, pickuseremail] = useState("");
    let[userpassword, pickuserpassword] = useState("");
    const userlogin = async() =>
    {
        if(useremail === "" || userpassword === "")
            swal("Enter Details","Correctly","warning");
        else
        {
            let usercheck = {email:useremail, password:userpassword};
            let userinfo = await login(config.userlogin, usercheck)
            console.log("user login ___",userinfo)
            if(userinfo.status)
            {
                console.log("user info _____", userinfo);
                localStorage.setItem("userid", userinfo.existingUser._id);
                localStorage.setItem("username", userinfo.existingUser.firstname);
                localStorage.setItem("usermobileno", userinfo.existingUser.mobile);
                localStorage.setItem('usertoken', userinfo.token);
                swal("Login Successfull", "Credentials are Matched Successfully", "success")
                .then(() => {
                    localStorage.setItem("userlogin", "false");
                    window.location.reload();    // Reload the page
                    
                });
                pickuseremail("");
                pickuserpassword("");
                setLoggedIn(true);
            }
            else 
                swal("Invalid Credentials", "Please check your email and password", "warning");
                
        }
    }

    if (loggedIn)
        return <Navigate to="/home" />;


    return(
            <div className="container mt-5">
                <div className="row mt-5 mb-4">
                    <div className="col-lg-4 col-sm-4 col-md-4 col-xl-4 col-xl-4"></div>
                    <div className="col-lg-4 col-sm-4 col-md-4 col-xl-4 col-xl-4">
                        <div className="card border-0 shadow-lg mt-5">
                            <div className="card-header text-center border-0">
                                <h1 className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xxl-12  text-center mb-4 mt-4"><i className="fa fa-shopping-bag text-warning"></i> SreeShop</h1>
                                <h3 className="mt-3 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xxl-12 text-primary"> <i className="fa fa-user me-1"></i> User Login </h3> 
                            </div>

                            <div className="card-body">
                                <div className="input-group mb-3">
                                    <span className="input-group-text justify-content-center col-2 border-2 border-black border-start-0 border-end-0 border-top-0 text-danger rounded-0">  <i className="fa fa-envelope"></i>  </span>
                                    <input type="email" className="form-control border-2 border-black border-start-0 border-end-0 border-top-0 rounded-0 shadow-none" placeholder="Enter Email" onChange={obj=>pickuseremail(obj.target.value)} value={useremail} />
                                </div>

                                <div className="input-group">
                                    <span className="input-group-text justify-content-center col-2 border-2 border-black border-start-0 border-end-0 border-top-0 rounded-0">  <i className="fa fa-lock"></i>  </span>
                                    <input type="password" className="form-control border-2 border-black border-start-0 border-end-0 border-top-0 rounded-0 shadow-none " placeholder="Enter Password" onChange={obj=>pickuserpassword(obj.target.value)} value={userpassword} />
                                </div>
                            </div>

                            <div className="card-footer text-center bg-white mt-2 border-0">
                                    
                                <button className="btn btn-primary text-center m-auto mt-2 mb-3" onClick={userlogin}> Login  <i className="fa fa-arrow-right"></i> </button>
                                <p className="text-center"> Or </p>
                                <p className="text-center"> Create New Account ? <Link to="/usersignup"> <b className="text-primary ms-2"> Signup </b> </Link> </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-sm-4 col-md-4 col-xl-4 col-xl-4"></div>
                </div>

            </div>
    )
}

export default Userlogin;