import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { login } from "../Api/apihandler";
import { config } from "../config";
import { Toast } from 'primereact/toast';

const Userlogin = () => {
    const [useremail, pickuseremail] = useState("");
    const [userpassword, pickuserpassword] = useState("");
    const toastRef = useRef(null); // Reference for the Toast


    const showToast = (severity, detail, isLoading = false) => {
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
        toastRef.current.show({ severity, summary: null, detail: content });
    };


    const home = () => {
        localStorage.setItem("userloginpermission", false);
        localStorage.setItem("usersignuppermission", false);
        window.close();
    }

    const userlogin = async () => {
        if (useremail === "" || userpassword === "") {
            showToast('error', 'Please enter both email and password');
        } 
        else {
            // Show loading toast
            showToast('info', 'Logging in, please wait...', true);
            let usercheck = { email: useremail, password: userpassword };
            await login(config.userlogin, usercheck)
            .then(userinfo =>{
                toastRef.current.clear(); 
                if (userinfo.status) {
                    showToast('success', 'Logged in successfully!');
                    localStorage.setItem("userid", userinfo.existingUser._id);
                    localStorage.setItem("username", userinfo.existingUser.firstname);
                    localStorage.setItem("usermobileno", userinfo.existingUser.mobile);
                    localStorage.setItem('usertoken', userinfo.token);
                    localStorage.setItem('userlogin', true);
                    // Clear input fields
                    
                    const toastDuration = 2000; 
                    setTimeout(() => {
                        pickuseremail("");
                        pickuserpassword("");
                        localStorage.setItem('userloginpermission', false);
                        if (window.opener) {
                            window.opener.location.reload(); // Refresh the original window
                        }
                        window.location.reload();
                        window.close(); // Reload the page
                    }, toastDuration);
                } 
                else {
                    showToast('error', 'Login failed. Please check your credentials');
                }
            })
            
        }
    }

    return (
        <div className="bg-dark">
            <Toast ref={toastRef} position="center" className="custom-toast" />
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="col-lg-8 col-sm-8 col-md-8 col-xl-8 m-auto">
                    <div className="p-2" style={{
                        backgroundImage: 'url("/userlogin.jpg")',
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
                                opacity: 0.9
                            }}>
                                <div className="card-header text-center border-0">
                                    <h1 className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xxl-12 text-center text-white mb-4 mt-4">
                                        <span> <img src="/sreeshop.jpg" width='50' height='50' alt="" /> </span> SreeShop
                                    </h1>
                                    <h3 className="mt-3 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xxl-12 text-primary">
                                        <i className="fa fa-user me-1"></i> User Login
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
                                    <button className="btn btn-primary text-center text-white m-auto mt-2 mb-3" onClick={userlogin}>
                                        Login <i className="fa fa-arrow-right"></i>
                                    </button>
                                    <p className="text-center text-white">Or</p>
                                    <p className="text-center text-white">
                                        Create New Account? <Link to="/usersignup"><b className="text-primary ms-2">Signup</b></Link>
                                    </p>
                                    <p onClick={home} className="text-decoration-underline fs-5"> <i className="fa fa-home"></i> Home  </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Userlogin;
