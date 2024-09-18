
import { useEffect, useState } from "react";
import swal from "sweetalert";
import { Link, useParams } from "react-router-dom";
import { Navigate } from "react-router-dom";

import { config } from "../config";
import { postData, fetchData } from "../Api/apihandler";

const Myprofile = () =>
{

    let[fname, pickfname] = useState("");
    let[fnameerror, pickfnameerror] = useState("correct");
    const fnamevalidation = (event)=>
    {
        const name = /^[a-zA-Z]{3,}$/;
        if(name.test(event))
            pickfnameerror("correct");
        else
            pickfnameerror("wrong");
    }



    let[lname, picklname] = useState("");
    let[lnameerror, picklnameerror] = useState("correct");
    const lnamevalidation = (event)=>
    {
        const name = /^[a-zA-Z]{3,}$/;
        if(name.test(event))
            picklnameerror("correct");
        else
            picklnameerror("wrong");
    }



    let[mobile, pickmobile] = useState("");
    let[mobileerror, pickmobileerror] = useState("correct");
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
    let[emailerror, pickemailerror] = useState("correct");
    let[checkemail, pickcheckemail] = useState("");
    const emailvalidation=async(event)=>
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
    let[gendererror, pickgendererror] = useState("correct");
    const gendervalidation=(event)=>
    {
        alert("hi praveen");
        if((event == "Male") || (event == "Female") || event == "Other")
        {
            pickgendererror("correct");
            alert("gender is comming here");
        }
        else
            pickgendererror("wrong");
    }



    let[password, pickpassword] = useState("");
    let[passworderror, pickpassworderror] = useState("correct");
    const passwordvalidation = (event) =>
    {
        const passwordpattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{}|;:'",.<>?]).{6,}$/;
        if(passwordpattern.test(event))
            pickpassworderror("correct")
        else    
            pickpassworderror("wrong");
    }



    let[cpassword, pickcpassword] = useState("");
    let[cpassworderror, pickcpassworderror] = useState("correct");
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
            setminutes(0);
            setseconds(59);
            let x = Math.floor(1000 + Math.random() * 9000);
            pickotp(x);
            let newemail = {
                                toemail:email, 
                                mysubject:"Your One-Time Password (OTP)",
                                mymessage:"Hello "+[ fname +" "+lname ]+",Your one-time password (OTP) for [Purpose, e.g., logging in, resetting your password, verifying your account] is: " + [ x ] 
                            }
            let response = await postData(config.sendemail, newemail) 

        }
        else
        {
            if(fnameerror == "")
                pickfnameerror("wrong");
            if(lnameerror == "")
                picklnameerror("wrong");
            if(mobileerror == "")
                pickmobileerror("wrong");
            if(emailerror == "")
                pickemailerror("wrong");
            if(gendererror == "")
                pickgendererror("wrong");
            if(passworderror == "")
                pickpassworderror("wrong");
            if(cpassworderror == "")
                pickcpassworderror("wrong");

        }
    }


    let[otp, pickotp] = useState(0);
    let[checkotp, pickcheckotp] = useState(0);

    const update = async() =>
    {
        if(parseInt(checkotp) == parseInt(otp))
        {
            
            let updateuser = { "firstname" : fname,
                            "lastname"  : lname,
                            "mobile"    : parseInt(mobile),
                            "email"     : email,
                            "gender"    : gender,
                            "password"  : password,
                        }
            await postData(`${config.updateuser}/${localStorage.getItem("userid")}`, updateuser)
            .then(userinfo =>{
                swal(userinfo.message," Updated Successfully","success");
                getdata();   
            })  
                
        }
        else
        {
            swal("OTP NOT MATCHED","Please Enter Correct OTP / Resend OTP","warning");
            pickcheckotp("");
        }

    }

    let{id} = useParams(); 
    const getdata = async() =>
    {
        if(localStorage.getItem("userid") != null)
        {
            await fetchData(`${config.userdetails}?id=${localStorage.getItem("userid")}`)
            .then(userinfo=>{
                pickfname(userinfo.firstname);
                picklname(userinfo.lastname);
                pickmobile(userinfo.mobile);
                pickemail(userinfo.email);
                pickgender(userinfo.gender);
                pickpassword(userinfo.password);
                pickcpassword(userinfo.password);
            })
        }
        
    }

    useEffect(()=>{getdata();}, []);

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



    if(localStorage.getItem("userid") === null)
    {
        swal("Please Login / Signup","You have Account Login / Signup","warning")
            .then(()=>{
                login()
            })
    }

    return(
        <div className="container">
            <div className="row mt-4">
                <div className="col-xl-4 col-xxl-4 col-lg-4 col-md-4 col-sm-4 m-auto pb-5"></div>
                    <div className="col-xl-4 col-xxl-4 col-lg-4 col-md-4 col-sm-4">
                        <div className="card shadow-lg pb-4">
                            <div className="card-header  text-white bg-primary">
                                <h2 className="text-center pt-2 pb-2"> <i className="fa fa-user"></i> Update your account </h2>
                            </div>

                            <div className="card-body">
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
                                    <div className="col-8 text-danger"> 
                                            <input type="number" className="form-control text-dark"
                                                style={{border:(mobile!="")?(mobileerror=="wrong")?'4px solid red':'4px solid green':((mobileerror=="wrong")?'4px solid red':''),
                                                boxShadow: (mobile!="")?(mobileerror=="wrong")?'0px 0px 5px red':'0px 0px 5px green':((mobileerror=="wrong")?'0px 0px 5px red':'')}}
                                                onChange={obj=> { pickmobile(obj.target.value); mobilevalidation(obj.target.value)}}
                                                value={mobile}
                                            />
                                            {checkmobile}
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-4 text-start">  <h6>Email </h6>  </div>
                                    <div className="col-8 text-danger"> 
                                        <input type="email" className="form-control bg-white" 
                                            style={{border:(email!="")?(emailerror=="wrong")?'4px solid red':'4px solid green':((emailerror=="wrong")?'4px solid red':''),
                                            boxShadow: (email!="")?(emailerror=="wrong")?'0px 0px 5px red':'0px 0px 5px green':((emailerror=="wrong")?'0px 0px 5px red':'')}}
                                            onChange={obj=> { pickemail(obj.target.value); emailvalidation(obj.target.value)}}
                                            value={email}
                                        /> 
                                        {checkemail}
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
                        </div>
                        <div className="col-6 m-auto">
                            <button className="btn btn-primary form-control border rounded-pill mb-3 mt-1" onClick={sendemail} data-bs-toggle="modal" data-bs-target="#myModal"> Update </button>
                        </div>
                        <p className="text-center"> Or </p>
                        <p className="text-center"> Already have an account? <Link to="/SreeShop/login"> <b className="text-primary ms-2"> Login</b> </Link> </p>
                    </div>
                </div>
                <div className="col-xl-4 col-xxl-4 col-lg-4 col-md-4 col-sm-4"></div>
            </div>

            <div class="modal fade custom-modal" id="myModal">
                <div class="modal-dialog modal-md">
                    <div class="modal-content">

                        <div class="modal-header">
                            <h3 className="modal-title ms-auto">Verify OTP</h3>
                            <button type="button" class="btn-close"  data-bs-dismiss="modal" ></button>
                        </div>

                        <div class="modal-body">
                            <input type="number" className="form-control" placeholder="Enter OTP"  onChange={obj=>pickcheckotp(obj.target.value)}/>
                            <div className="row pt-4">
                                <p className="col-7">Time Remaining :  {" "}
                                    <span style={{fontWeight:600}}>
                                    {minutes < 10 ? `0${minutes}` : minutes}:
                                    {seconds < 10 ? `0${seconds}` : seconds}
                                    </span> </p>
                                <label className="col-5 text-danger text-decoration-underline"
                                disabled={seconds > 0 || minutes > 0}  
                                onClick={sendemail}> Resend OTP
                                </label> 

                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-success m-auto" 
                                        data-bs-dismiss= {(parseInt(otp) === parseInt(checkotp)) ?  "modal" : "" } 
                                        onClick={update}>
                                    SUBMIT
                            </button>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Myprofile;




const login = () =>
{
    localStorage.setItem("userlogin", "true");
    window.location.reload();
}
