
import { HashRouter, Routes, Route, Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";


import Mydashboard from "./dashboard";
import Mynewproduct from "./newproduct";
import Myproductlist from "./productlist";
import Myorderlist from "./orderlist";
import Mybrandcategory from "./brandcategory";

import Chartsdata from "../charts/chartsdata";

const Sellerapp = () =>
{

    const homepage = () =>
    {
        localStorage.setItem("SreeShoppermit", "sellerlogout");
        window.close();
    }

    return(
        <HashRouter>
            <nav className="navbar navbar-expand-sm navbar-dark bg-sellernav p-2">
                <div className="container">
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                        <i className="fa fa-shopping-bag fs-1"></i>
                        <span className="ms-2 fs-1 text-white" style={{ fontFamily: 'Roboto, sans-serif', }}>Sree</span>
                        <span className="ms-1 fs-1 text-white" style={{ fontFamily: 'Roboto, sans-serif', }}>Shop</span>
                    </span>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="mynavbar">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item me-4">
                                <Link className="nav-link active fs-5" to="/dashboard"> <i className="fa fa-dashboard"></i> Dashboard</Link>
                            </li>

                            <li className="nav-item me-4">
                                <div class="dropdown">
                                    <button class="btn pt-2 fs-5 p-0 text-white border-0" data-bs-toggle="dropdown">
                                        <i className="fa fa-plus me-1"></i> New Product
                                    </button>
                                    <ul class="dropdown-menu mt-4 ps-2 pt-3 pb-3 border border-3 border-dark" style={{ minWidth: '300px' }}>
                                        <li className="mb-2"> <Link to="/brand" className="text-decoration-none sellernav-dropdown"> <i className="fa fa-tags me-2"></i>   New Brand & Category </Link> </li>
                                        <li> <Link to="/newproduct" className="text-decoration-none sellernav-dropdown "> <i className="fa fa-cart-plus me-2"></i> New Product </Link> </li>
                                    </ul>
                                </div>
                            </li>
                            <li className="nav-item me-4 fs-5">
                                <Link className="nav-link active" to="/productlist"> <i className="fa fa-suitcase"></i> Product List</Link>
                            </li>
                            <li className="nav-item me-4 fs-5">
                                <Link className="nav-link active" to="/orderlist"> <i className="fa fa-headset"></i> Order List</Link>
                            </li>
                            <li className="nav-item fs-5">
                                <Link onClick={sellerlogout} className="nav-link text-white">Welcome <b className="text-decoration-underline me-2"> {localStorage.getItem("sellername")} </b> <i className="fa fa-power-off"></i> <b onClick={homepage}> Logout </b></Link>
                            </li>   
                        </ul>
                    </div>
                </div>
            </nav>




            <div className="container">
                <div className="col-lg-12"> <h4 onClick={homepage}> <i class="fa-solid fa-angle-left"></i> Home</h4> </div>
            </div>




            <Routes>
                <Route path="/dashboard" element={ <Mydashboard/>} />
                <Route exact path="/dashboard" element={ <Mydashboard/> }  />
                <Route exact path="/newproduct" element={ <Mynewproduct/> } />
                <Route exact path="/productlist" element={ <Myproductlist/> } />
                <Route exact path="/orderlist" element={ <Myorderlist/> } />
                <Route exact path="/brand" element={ <Mybrandcategory/> } />
                <Route exact path="/chartsdata" element={ <Chartsdata/> } />

                {localStorage.getItem("sellerid") != null && <Route path="/*" element={<Navigate to="/dashboard" replace />} />}
            </Routes>


            <div className="row p-0 m-0 text-center mt-5 mb-5">
                <div className="col-sm-4 m-auto">
                    <button onClick={homepage} className="btn btn-warning text-white btn-lg"> <i className="fa fa-arrow-left me-1"></i> Back to Home </button>
                </div>
            </div>


            
            <footer className="bg-dark text-white mt-5 pt-5 pb-5">
                <div className="container">
                    <div className="row">
                        <div className="col-4 m-auto mt-0">
                            <div className="m-auto">
                                <h5 className="text-warning mb-3"> Get to Know Us </h5>
                                <p> Contact Us </p>
                                <p> Careers </p>
                                <p> Abouts Us </p>
                                <p> Corporate Information</p>
                            </div>
                        </div>
                        <div className="col-3 m-auto mt-0">
                            <div className="m-auto">
                                <h5 className="text-warning mb-3"> Connect With Us </h5>
                                <p> <i className="fab fa-facebook me-2"></i> facebook </p>
                                <p> <i className="fab fa-twitter me-2"></i> Twitter </p>
                                <p> <i className="fab fa-instagram me-2"></i> Instagram </p>
                                <p> <i className="fab fa-linkedin me-2"></i> Linkedin </p>
                            </div>
                        </div>
                        <div className="col-5 m-auto mt-0">
                            <div className="m-auto">
                                <h5 className="text-warning mb-3"> Registerd Office Address </h5>
                                <p> Address : No. 33, Covery Complex, 2nd Floor, infocampus Logics Pvt Ltd, 
                                    Outer Ring Road, Marathahalli Bangalore Karnataka 560037. Near Kalamandir <br/>
                                    <hr/>
                                    Contact No : +91-8884166608. +91-9738001024 <br/>
                                    E-Mail : hr.infocampus@gmail.com 
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

        </HashRouter> 
    )
}

export default Sellerapp;

const sellerlogout = () =>
{
    localStorage.removeItem('sellerid');
    localStorage.setItem("SreeShoppermit", "sellerlogout");
    window.close();
}
