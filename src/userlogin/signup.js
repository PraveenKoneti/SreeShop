
import { useEffect, useState, useRef } from "react";
import swal from "sweetalert";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { InputOtp } from 'primereact/inputotp'; 
import { Toast } from 'primereact/toast';

import { config } from "../config";
import { register, postData } from "../Api/apihandler";

import { Modal, Button } from 'react-bootstrap';

const Usersignup = () =>
{
    const [showModal, setShowModal] = useState(false);
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






    let[fname, pickfname] = useState("");
    let[fnameerror, pickfnameerror] = useState("");
    const fnamevalidation = (event)=>
    {
        const name = /^[a-zA-Z]{3,}$/;
        if(name.test(event))
            pickfnameerror("correct");
        else
            pickfnameerror("wrong");
    }



    let[lname, picklname] = useState("");
    let[lnameerror, picklnameerror] = useState("");
    const lnamevalidation = (event)=>
    {
        const name = /^[a-zA-Z]{3,}$/;
        if(name.test(event))
            picklnameerror("correct");
        else
            picklnameerror("wrong");
    }



    let[mobile, pickmobile] = useState("");
    let[mobileerror, pickmobileerror] = useState("");
    let[checkmobile, pickcheckmobile] = useState("");
    const mobilevalidation=async(event)=>
    {
        let mpattern = /^[6789]\d{9}$/
        if(mpattern.test(event))
        {
            let userinfo = await postData(config.checkuser, {value : parseInt(event)})
            if(userinfo.length > 0)
            {
                pickmobileerror("wrong");
                pickcheckmobile("This number is already existed");
            }
            else
            {
                pickmobileerror("correct");
                pickcheckmobile("");
            }
        }
        else
        {
            pickmobileerror("wrong");
            pickcheckmobile("");
        }
    }



    let[email, pickemail] = useState("");
    let[emailerror, pickemailerror] = useState("");
    let[checkemail, pickcheckemail] = useState("");
    const emailvalidation= async(event)=>
    {
        let epatern = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
        if(epatern.test(event))
        {
            let userinfo = await postData(config.checkuser, {value : event})
            if(userinfo.length > 0)
            {
                pickemailerror("wrong");
                pickcheckemail("This Email is already existed");
            }
            else
            {
                pickemailerror("correct");
                pickcheckemail("");
            }
        }
        else
        {
            pickemailerror("wrong");
            pickcheckemail("");
        }
    }


    let[gender, pickgender] = useState("");
    let[gendererror, pickgendererror] = useState("");
    const gendervalidation=(event)=>
    {
        if((event == "Male") || (event == "Female") || event == "Other")
            pickgendererror("correct");
        else
            pickgendererror("wrong");
    }



    let[password, pickpassword] = useState("");
    let[passworderror, pickpassworderror] = useState("");
    const passwordvalidation = (event) =>
    {
        const passwordpattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{}|;:'",.<>?]).{6,}$/;
        if(passwordpattern.test(event))
            pickpassworderror("correct")
        else    
            pickpassworderror("wrong");
    }



    let[cpassword, pickcpassword] = useState("");
    let[cpassworderror, pickcpassworderror] = useState("");
    const cpasswordvalidation  = (event) =>
    {
        if((password == event))
            pickcpassworderror("correct");
        else
            pickcpassworderror("wrong");
    }


    const sendemail = async() =>
    {
        if((fnameerror === "correct") && (lnameerror === "correct") && (mobileerror === "correct") && (emailerror === "correct") && (gendererror === "correct") && (passworderror === "correct"))
        {
            showToast('info', `Sending OTP to ${email}, please wait...`, true);
            let x = Math.floor(1000 + Math.random() * 9000);
            pickotp(x);
            let newemail = {
                toemail:email, 
                mysubject:"Your One-Time Password (OTP)",
                mymessage:"Hello "+[ fname +" "+lname ]+",Your one-time password (OTP) for [Purpose, e.g., logging in, resetting your password, verifying your account] is: " + [ x ] 
            }
            await postData(config.sendemail, newemail) 
            .then(response =>{ 
                toastRef.current.clear();

                // Show success or failure toast based on response
                if (response.status) {
                    showToast('success', `OTP sent successfully to ${email}!`);
                    setminutes(0);
                    setseconds(59);
                    setTimeout(() => {
                        setShowModal(true);
                    }, 2000); 
                } else {
                    showToast('error', 'Failed to send OTP. Please try again.');
                }
            })
        }
        else
        {
            if(fnameerror === "")
                pickfnameerror("wrong");
            if(lnameerror === "")
                picklnameerror("wrong");
            if(mobileerror === "")
                pickmobileerror("wrong");
            if(emailerror === "")
                pickemailerror("wrong");
            if(gendererror === "")
                pickgendererror("wrong");
            if(passworderror === "")
                pickpassworderror("wrong");
            if(cpassworderror === "")
                pickcpassworderror("wrong");

            showToast('error', 'Please enter the required fields.');
        }
    }


    let[otp, pickotp] = useState(0);
    let[checkotp, pickcheckotp] = useState(0);
    const [loggedIn, setLoggedIn] = useState(false);

    const signup = async() =>
    {
        if(parseInt(checkotp) === parseInt(otp))
        {
            showToast('info', 'Processing your request, please wait...', true);
            let newuser = { "firstname" : fname,
                            "lastname"  : lname,
                            "mobile"    : parseInt(mobile),
                            "email"     : email,
                            "gender"    : gender,
                            "password"  : password
                        }
            
            await register(config.userregister, newuser)
            .then(userinfo => {
                toastRef.current.clear();
                if(userinfo && userinfo !== ""){
                    showToast('success', `${userinfo.message}, Registered Successfully!`);
                    setTimeout(() => {
                        setLoggedIn(true);
                    }, 3000);
    
                    pickfname("");
                    picklname("");
                    pickmobile("");
                    pickemail("");
                    pickgender("");
                    pickpassword("");
                    pickcpassword("");
                    pickcheckotp("");
                }  
                else
                    showToast('error', "Wrong Details Entered"); 

                setShowModal(false);  
            })       
        }
        else
        {
            showToast('error', "OTP NOT MATCHED. Please Enter Correct OTP / Resend OTP.");
            pickcheckotp("");

        }
    }


    const [minutes,setminutes]=useState(0);
    const [seconds,setseconds]=useState(59);
    useEffect(()=>{
        const interval=setInterval(()=>{
            //decrease seconds if greater than 0
            if(seconds>0)
            {
                setseconds(seconds-1);
            }
            //when seconds reaches 0 ,decrease minutes if greater than 0
            if(seconds===0)
            {
                if(minutes===0)
                {
                    //stop the countdown when both minutes and seconds are zero
                    clearInterval(interval);
                }
                else
                {
                    //reset seconds to 59 and decrease minutes by 1
                    setseconds(59);
                    setminutes(minutes-1);
                }
            }
        },1000);
        return () => {
            //cleanup: stop the interval when the component unmounts
            clearInterval(interval);
        };
    },[seconds]); 




    if (loggedIn)
        return <Navigate to="/userlogin" />;



    return(
        <div className="bg-dark">
            <Toast ref={toastRef} position="center" className="custom-toast" />
            <div className="d-flex justify-content-center align-items-center vh-120">
                <div className="col-lg-8 col-sm-8 col-md-8 col-xl-8 m-auto">
                    <div className="p-2" style={{
                        backgroundImage: 'url("/usersignup.jpg")', 
                        width: 'auto', 
                        backgroundSize: 'cover', 
                        height: 'auto', // Set to full viewport height for mobile
                        backgroundPosition: 'center', 
                        backgroundRepeat: 'no-repeat'}}>
                        <div className=" p-2 mt-2">
                                <div className="col-lg-6 col-sm-6 col-md-6 col-xl-6 col-xxl-6"></div>
                                <div className="col-lg-6 col-sm-6 col-md-6 col-xl-6 col-xl-6 shadow-lg pb-3 p-2 ms-auto" style={{ background: "", opacity: 0.9 }}>
                                    <h1 className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xxl-12  text-center mb-3 mt-2"><span> <img src="/sreeshop.jpg" width='50' height='50' alt="" /> </span> SreeShop</h1>
                                    <h6 className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xxl-12 text-center text-primary mb-4"> <i className="fa fa-user"></i> Create your account </h6>
                                    
                                    <div className="row mb-3">
                                        <div className="col-4 text-start"> <h6>First Name </h6> </div>
                                        <div className="col-8"> 
                                            <input type="text"  className="form-control" 
                                                style={{border:(fname!="")?(fnameerror=="wrong")?'4px solid red':'4px solid green':((fnameerror=="wrong")?'4px solid red':''),
                                                boxShadow: (fname!="")?(fnameerror=="wrong")?'0px 0px 5px red':'0px 0px 5px green':((fnameerror=="wrong")?'0px 0px 5px red':'')}}
                                                onChange={obj=> { pickfname(obj.target.value); fnamevalidation(obj.target.value)}}
                                                value={fname}  
                                            />
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-4 text-start"> <h6>Last Name </h6> </div>
                                        <div className="col-8"> 
                                            <input type="text"  className="form-control" 
                                                style={{border:(lname!="")?(lnameerror=="wrong")?'4px solid red':'4px solid green':((lnameerror=="wrong")?'4px solid red':''),
                                                boxShadow: (lname!="")?(lnameerror=="wrong")?'0px 0px 5px red':'0px 0px 5px green':((lnameerror=="wrong")?'0px 0px 5px red':'')}}
                                                onChange={obj=> { picklname(obj.target.value); lnamevalidation(obj.target.value)}} 
                                                value={lname} 
                                            />
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-4 text-start"> <h6>Mobile </h6> </div>
                                        <div className="col-8"> 
                                                <input type="number" className="form-control text-dark"
                                                    style={{border:(mobile!="")?(mobileerror=="wrong")?'4px solid red':'4px solid green':((mobileerror=="wrong")?'4px solid red':''),
                                                    boxShadow: (mobile!="")?(mobileerror=="wrong")?'0px 0px 5px red':'0px 0px 5px green':((mobileerror=="wrong")?'0px 0px 5px red':'')}}
                                                    onChange={obj=> { pickmobile(obj.target.value); mobilevalidation(obj.target.value)}}
                                                    value={mobile}
                                                />
                                                <i className="text-danger"> {checkmobile} </i>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-4 text-start">  <h6>Email </h6>  </div>
                                        <div className="col-8"> 
                                            <input type="email" className="form-control bg-white" 
                                                style={{border:(email!="")?(emailerror=="wrong")?'4px solid red':'4px solid green':((emailerror=="wrong")?'4px solid red':''),
                                                boxShadow: (email!="")?(emailerror=="wrong")?'0px 0px 5px red':'0px 0px 5px green':((emailerror=="wrong")?'0px 0px 5px red':'')}}
                                                onChange={obj=> { pickemail(obj.target.value); emailvalidation(obj.target.value)}}
                                                value={email}
                                            /> 
                                            <i className="text-danger"> {checkemail} </i>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-4 text-start">  <h6>Gender</h6>  </div>
                                        <div className="col-8">
                                            <select className="form-select" onChange={obj=>{pickgender(obj.target.value); gendervalidation(obj.target.value)}} value={gender}
                                                style={{border : (gender!="")?(gendererror=="correct")?'4px solid green':'4px solid red':((gendererror=="wrong")?'4px solid red':''),
                                                boxShadow: (gender!="")?(gendererror=="wrong")?'0px 0px 5px red':'0px 0px solid':((gendererror=="wrong")?'0px 0px 5px red':'')}}
                                            >
                                                <option value="">Choose</option>
                                                <option> Male </option>
                                                <option> Female </option>
                                                <option> Other </option>
                                            </select>
                                        </div>
                                    </div>


                                    <div className="row mb-3">
                                        <div className="col-4 text-start">  <h6>Password</h6> </div>
                                        <div className="col-8">  
                                            <input type="password" className="form-control" 
                                                style={{border:(password!="")?(passworderror=="wrong")?'4px solid red':'4px solid green':((passworderror=="wrong")?'4px solid red':''),
                                                boxShadow: (password!="")?(passworderror=="wrong")?'0px 0px 5px red':'0px 0px 5px green':((passworderror=="wrong")?'0px 0px 5px red':'')}}
                                                onChange={obj=> { pickpassword(obj.target.value); passwordvalidation(obj.target.value)}}
                                                value={password}
                                            /> 
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-4 text-start">  <h6>C-Password</h6>  </div>
                                        <div className="col-8"> 
                                            <input type="password" className="form-control" 
                                                style={{border:(cpassword!="")?(cpassworderror=="wrong")?'4px solid red':'4px solid green':((cpassworderror=="wrong")?'4px solid red':''),
                                                boxShadow: (cpassword!="")?(cpassworderror=="wrong")?'0px 0px 5px red':'0px 0px 5px green':((cpassworderror=="wrong")?'0px 0px 5px red':'')}}
                                                onChange={obj=> { pickcpassword(obj.target.value); cpasswordvalidation(obj.target.value)}}
                                                value={cpassword}
                                            /> 
                                        </div>
                                    </div>

                                    <div className="text-center">  <button className="btn col-6  btn-primary form-control border rounded-pill mb-3 mt-1" onClick={sendemail} > Sign Up </button> </div>
                                    <p className="text-center"> Or </p>
                                    <p className="text-center" > Already have an account? <Link to="/userlogin"> <b className="text-primary ms-2"> Login</b> </Link> </p>
                                    <p onClick={home} className="text-decoration-underline fs-5 text-center"> <i className="fa fa-home"></i> Home  </p>
                                </div>
                        </div>


                        <Modal show={showModal} onHide={() => setShowModal(false)} className="custom-modal" size="md" centered>
                            <Modal.Header closeButton>
                                <Modal.Title className="ms-auto">Verify OTP</Modal.Title>
                            </Modal.Header>

                            <Modal.Body>
                                <div className="d-flex justify-content-center">
                                    <InputOtp value={checkotp} onChange={(e) => pickcheckotp(e.value)} className="p-inputtext p-component" />
                                </div>
                                <div className="row pt-4 text-center">
                                    <p className="col-7">Time Remaining: {" "}
                                        <span style={{ fontWeight: 600 }}>
                                            {minutes < 10 ? `0${minutes}` : minutes}:
                                            {seconds < 10 ? `0${seconds}` : seconds}
                                        </span>
                                    </p>
                                    <label className="col-5 text-danger text-decoration-underline"
                                        disabled={seconds > 0 || minutes > 0}
                                        onClick={sendemail}> 
                                        Resend OTP
                                    </label>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button 
                                    variant="success" 
                                    onClick={signup}
                                    disabled={parseInt(otp) !== parseInt(checkotp)} // Disable button if OTP does not match
                                >
                                    SUBMIT
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>    
            </div>
        </div>
    )
}

export default Usersignup;

const home = () => {
    localStorage.setItem("userloginpermission", false);
    localStorage.setItem("usersignuppermission", false);
    window.close();
}