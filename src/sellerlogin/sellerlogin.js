
import { useState } from "react";
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
        if(useremail === "" || userpassword === "")
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
        <div className="bg-dark">
        <div className="d-flex justify-content-center align-items-center vh-120">
            <div className="col-lg-8 col-sm-8 col-md-8 col-xl-8 m-auto">
                <div className="p-2" style={{
                    backgroundImage: 'url("/sellerlogin.jpg")',
                    width: 'auto',
                    backgroundSize: 'cover',
                    height: 'auto',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}>
                    <div className="col-lg-6 col-sm-6 col-md-6 col-xl-6 col-xl-6"></div>
                    <div className="col-lg-6 col-sm-6 col-md-6 col-xl-6 col-xl-6 ms-auto">
                        <div className="card border-0 p-2 shadow-lg mt-5 mb-5" style={{
                            background: "rgba(0, 0, 0, 0.5)",
                            opacity: '0.9'
                        }}>
                            <div className="card-header text-center border-0">
                                <h1 className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xxl-12 text-center text-white mb-4 mt-4">
                                    <span> <img src="/sreeshop.jpg" width='50' height='50' alt="" /> </span> SreeShop
                                </h1>
                                <h3 className="mt-3 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xxl-12 text-white">
                                    <i className="fa fa-user me-1"></i> Seller Login
                                </h3>
                            </div>
                            <div className="card-body">
                                <div className="input-group mb-3">
                                    <span className="input-group-text bg-dark justify-content-center col-2 border-dark text-danger rounded-0">
                                        <i className="fa fa-envelope"></i>
                                    </span>
                                    <input type="email" className="form-control rounded-0 shadow-none" placeholder="Enter Email" onChange={obj => pickuseremail(obj.target.value)} value={useremail} />
                                </div>
                                <div className="input-group">
                                    <span className="input-group-text bg-dark text-white justify-content-center col-2 border-dark rounded-0">
                                        <i className="fa fa-lock"></i>
                                    </span>
                                    <input type="password" className="form-control rounded-0 shadow-none" placeholder="Enter Password" onChange={obj => pickuserpassword(obj.target.value)} value={userpassword} />
                                </div>
                            </div>
                            <div className="card-footer text-center text-white mt-2 border-0">
                                <button className="btn btn-primary text-center text-white m-auto mt-2 mb-3" onClick={login}>
                                    Login <i className="fa fa-arrow-right"></i>
                                </button>
                                <p className="text-center text-white">Or</p>
                                <p className="text-center text-white">
                                    Create New Account? <Link to="/sellersignup"><b className="text-primary ms-2">Signup</b></Link>
                                </p>
                                <p onClick={homepage} className="text-decoration-underline fs-5"> <i className="fa fa-home"></i> Home  </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default Sellerlogin;