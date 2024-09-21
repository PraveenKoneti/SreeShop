import { useState,} from "react";
import { HashRouter, Routes, Route, Link,} from "react-router-dom";
import { Navigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';

import Home from "../nav/home";
import Myprofile from "../nav/myprofile";
import Myorders from "../nav/myorders";
import Mywishlist from "../nav/mywishlist";
import Cartlist from "../nav/cartlist";
import Mybill from "../nav/mybill";

import Displaytype from "../displayitems/displaytype";
import Displaysingle from "../displayitems/displaysingle";

import Userlogin from "../userlogin/login";
import Usersignup from "../userlogin/signup";

import Handlesellerpage from "../sellerlogin/sellerpageshandle";
import { fetchData } from "../Api/apihandler";
import { config } from "../config";

const Adminapp = ()=>
{
    
    let[searchkey, picksearchkey] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);


    const handleInputChange = async(e) => {
        const value = e.target.value;
        picksearchkey(value);

        await fetchData(`${config.productsearch}?searchquery=${value}`)
        .then(filtered => {
            setFilteredSuggestions(filtered);
        });
    };

    const truncateProductName = (productName, maxWords = 14) => {
        const words = productName.split(' ');
        return words.slice(0, maxWords).join(' ');
    };


    const onsearch = (product) =>
    {
        picksearchkey(product.productname);
        setFilteredSuggestions([]);
    }


    window.addEventListener('beforeunload', function () {
        localStorage.removeItem("SreeShoppermit");
    });

    return(
        <HashRouter>
                <nav className="sticky-top">
                    <nav className="navbar navbar-expand-sm navbar-dark p-1 bg-dark">
                        <div className="container">
                            <span style={{ display: 'flex', alignItems: 'center' }}>
                                <i className="fa fa-shopping-bag fs-1 text-warning"></i>
                                <span className="ms-2 fs-1 text-white" style={{ fontFamily: 'Roboto, sans-serif', }}>Shree</span>
                                <span className="ms-1 fs-1 text-white" style={{ fontFamily: 'Roboto, sans-serif', }}>Shop</span>
                            </span>

                            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar-1">
                                <span class="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse me-2" id="mynavbar-1">
                                <ul className="navbar-nav ms-auto ">
                                    <li className="nav-item me-2 p-2">
                                        <div className="col-12">
                                            <form class="d-flex">
                                                <div class="input-group">
                                                    <input type="search" className="form-control shadow-none border-0" size="30" placeholder="Search here..." name="Product"
                                                        onChange={handleInputChange} value={searchkey}
                                                    />
                                                    <Link className="input-group-text bg-warning text-decoration-none border-warning"> <i className="fa fa-search"></i> </Link>
                                                </div>
                                            </form>
                                            {
                                                searchkey && (
                                                    <ul className="suggestions-list list-group position-absolute mt-2 scrollable-list">
                                                        {filteredSuggestions.map(suggestion => (
                                                            <li key={suggestion._id} className="list-group-item">
                                                                <Link to={`/${suggestion.categoryname}-${suggestion.brandname}`} className="text-decoration-none text-black" onClick={() => onsearch(suggestion)}> {truncateProductName(suggestion.productname)}</Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )
                                            }
                                        </div>
                                    </li>
                                    <li className="nav-item me-4 p-2">
                                        <Link className="text-decoration-none text-primary fs-5" to="/home"> <i className="fa fa-home"></i> Home </Link>
                                    </li>
                                    <li className="nav-item me-4 p-2">
                                        <Link onClick={Sellerpage} className="text-decoration-none text-success fs-5" target="_blank" rel="noopener noreferrer"><i class="fa fa-store"></i> Become a Seller</Link>
                                    </li>
                                    <li className="nav-item me-4 p-2">
                                        <Link className="text-decoration-none text-warning fs-5" to="/cartlist"><i className="fa fa-shopping-cart"></i> Cart </Link>
                                    </li>
                                    <li className="nav-item me-4 p-2">
                                        <div className="dropdown dropdown-menu-end">
                                            <button type="button" className="btn fs-5 p-0 text-white border-0 dropdown-toggle" data-bs-toggle="dropdown">
                                                <i className="fa-regular fa-circle-user me-2"></i>
                                                {localStorage.getItem("id") !== "" ? localStorage.getItem("username") || "Profile" : "Profile"}
                                            </button>
                                            <ul className="dropdown-menu" style={{ minWidth: '248px' }} >
                                                <li className="ms-3 pt-3 pb-3"> <b>New Customer ?</b> <Link to='/usersignup' className="text-decoration-none ms-2 fs-5"> Sign Up </Link>  </li>
                                                <li className="mb-3"> <hr className="dropdown-divider"  /> </li>
                                                <li className="mb-3"> <Link to="/myprofile" className="ms-3 text-decoration-none fs-6"> <i className="fa-regular fa-circle-user"></i> My Profile </Link> <i className="ms-2">Hi {localStorage.getItem("username")}</i> </li>
                                                <li className="mb-3"> <Link to="/myorders" className="ms-3 text-decoration-none fs-6"> <i class="fa fa-database"></i>  My Orders</Link> </li>
                                                <li className="mb-3"> <Link to="/mywishlist" className="ms-3 text-decoration-none fs-6"> <i className="fa-regular fa-heart"></i> Wishlist </Link> </li>
                                                <li className="mb-3"> <Link className="ms-3 text-decoration-none fs-6"> <i className="fa fa-gift"></i> Rewards </Link> </li>
                                                <li className="mb-3 text-center">
                                                    <div className="row ms-2">
                                                        {(localStorage.getItem("userid") == null) ?
                                                            (
                                                                <div className="col-xl-6 m-auto">
                                                                    <Link to="/userlogin"> <button className="btn btn-primary form-control  custom-btndropdown"> Login </button> </Link>  
                                                                </div>
                                                            ):
                                                            (
                                                                <div className="col-xl-6 m-auto">
                                                                    <button className="btn btn-danger form-control custom-btndropdown" onClick={Logout}>  Logout </button>
                                                                </div>
                                                            )
                                                        }  
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                


                    <nav className="bg-warning nav-bar">
                        <div className="container ms-2 nav-category">
                            <Link className="text-white text-decoration-none  nav-category" data-bs-toggle="offcanvas" data-bs-target="#demo"> <i className="fa fa-list text-white me-2"></i> All </Link>
                            <Link to="/kids wear" className="text-white text-decoration-none  nav-category"> Kids Wear </Link>              
                            <Link to="/mens wear" className="text-white text-decoration-none  nav-category"> Mens Wear </Link>
                            <Link to="/womens wear" className="text-white text-decoration-none  nav-category"> Womens Wear </Link>
                            <Link to="/bags" className="text-white text-decoration-none  nav-category"> Bags </Link>
                            <Link to="/head phones" className="text-white text-decoration-none  nav-category"> Head Phones </Link>
                            <Link to={`/${'mobiles'}-${""}`} className="text-white text-decoration-none  nav-category"> Mobiles </Link>
                            <Link to="/laptops" className="text-white text-decoration-none  nav-category"> Laptops </Link>
                            <Link to="/watches" className="text-white text-decoration-none  nav-category"> Watches </Link>
                            <Link to="/electronic gadgets" className="text-white text-decoration-none  nav-category"> Elec-Goods </Link>
                            <Link to="/footwear" className="text-white text-decoration-none  nav-category"> Footwear </Link>
                            <Link to="/shampoos" className="text-white text-decoration-none  nav-category"> Shampoos </Link>
                            <Link to="/moisturizers" className="text-white text-decoration-none  nav-category"> Moisturizers </Link>
                        </div>
                    </nav>
                </nav>



            <Routes>

                <Route path="/*" element={ <Home/> } />
                <Route exact path="/home" element={ <Home/> } />
                <Route exact path="/cartlist" element={ <Cartlist/> } />
                <Route exact path="/myprofile" element={ <Myprofile/> } />
                <Route exact path="/myorders" element= { <Myorders/> } />
                <Route exact path="/mywishlist" element= { <Mywishlist/> } />
                <Route exact path="/mybill" element= { <Mybill/> } />

                <Route exact path="/userlogin" element={ <Userlogin/> } />
                <Route exact path="/usersignup" element={ <Usersignup/> } />

                <Route exact path="/:category" element={ <Displaytype/> } /> 
                <Route exact path="/:searchvalue" element={ <Displaytype/> } /> 
                <Route exact path="/:category/:id" element= { <Displaysingle/> } />

                <Route exact path="/becomeseller" element={ <Handlesellerpage/> } />

                {localStorage.getItem("userlogin") === "false" && <Route path="/Home" element={<Navigate to="/Home" replace />} />}
                {localStorage.getItem("SreeShoppermit") === "sellerlogout" && <Route path="/Home" element={<Navigate to="/Home" replace />} />}

            </Routes>




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

            
            
            <div className="offcanvas offcanvas-start custom-offcanvas" id="demo">
                <div className="offcanvas-header">
                    <h1 className="offcanvas-title">Heading</h1>
                    <button type="button" className="btn-close btn-danger" data-bs-dismiss="offcanvas"></button> 
                </div>
                <div className="offcanvas-body">
                    <p>Some text lorem ipsum.</p>
                    <p>Some text lorem ipsum.</p>
                    <p>Some text lorem ipsum.</p>
                </div> 
            </div>
                  
            


        </HashRouter>
    )
}

export default Adminapp;

const Logout = () =>
{
    localStorage.clear();
    window.location.reload();
}

const Sellerpage = () => {
    localStorage.setItem("SreeShoppermit", "sellerlogin");
    const sellerPageUrl = "SreeShop/becomeseller"; // Replace with your seller page URL
    window.open(sellerPageUrl, "_blank");
}