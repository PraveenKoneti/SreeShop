import { useState, useEffect} from "react";
import { Routes, Route, Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { Navigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';

import Home from "../nav/home";
import Myprofile from "../nav/myprofile";
import Myorders from "../nav/myorders";
import Mywishlist from "../nav/mywishlist";
import Cartlist from "../nav/cartlist";
import Rewards from "../nav/rewards";

import Displaytype from "../displayitems/displaytype";
import Displaysingle from "../displayitems/displaysingle";

import Userlogin from "../userlogin/login";
// import Usersignup from "../userlogin/signup";

import Handlesellerpage from "../sellerlogin/sellerpageshandle";
import { fetchData } from "../Api/apihandler";
import { config } from "../config";

const Adminapp = ()=>
{
    
    let[searchkey, picksearchkey] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);


    const location = useLocation();
    const currentPath = location.pathname;


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
        localStorage.setItem("usersignuppermission", false);
    });
    



    return(
        <>
                <nav className="sticky-top">
                    <nav className="navbar navbar-expand-sm navbar-dark p-1 bg-dark">
                        <div className="container-fluid p-2">
                            <span style={{ display: 'flex', alignItems: 'center' }}>
                                <span> <img src="/sreeshop.jpg" width='50' height='50' alt="" /> </span>
                                <span className="ms-2 fs-1 text-white" style={{ fontFamily: 'Roboto, sans-serif', }}>Sree</span>
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
                                        <div className="dropdown dropstart">
                                            <button type="button" className="btn fs-5 p-0 text-white border-0" data-bs-toggle="dropdown">
                                                <i className="fa-regular fa-circle-user me-2"></i>
                                                {localStorage.getItem("id") !== "" || localStorage.getItem("id") !== null ? localStorage.getItem("username") || "Profile" : "Profile"}
                                            </button>
                                            <ul className="dropdown-menu" style={{ width: '300px', position: 'absolute', top: '100%', right: 0, left: 'auto', transform: 'translateX(0)' }}>
                                                {localStorage.getItem("userid") === null ? (
                                                    // If the user is NOT logged in
                                                    <>
                                                        <li className="ms-3 pt-3 pb-3">
                                                            <b>New Customer?</b>
                                                            <Link onClick={userSignup} className="text-decoration-none ms-2 fs-5">Sign Up</Link>
                                                        </li>
                                                    </>
                                                ) : (
                                                    // If the user IS logged in, show something different
                                                    <>
                                                        <li className="ms-3 pt-3 pb-3">
                                                            <b>Welcome Back!</b>
                                                            <span className="ms-2 fs-5">Hi {localStorage.getItem("username")}</span>
                                                        </li>
                                                    </>
                                                )}
                                                <li className="mb-3">
                                                    <hr className="dropdown-divider" />
                                                </li>
                                                <li className="mb-3">
                                                    <Link to="/myprofile" className="ms-3 text-decoration-none fs-6">
                                                        <i className="fa-regular fa-circle-user"></i> My Profile
                                                    </Link>
                                                    <i className="ms-2">Hi {localStorage.getItem("username")}</i>
                                                </li>
                                                <li className="mb-3">
                                                    <Link to="/myorders" className="ms-3 text-decoration-none fs-6">
                                                        <i className="fa fa-database"></i> My Orders
                                                    </Link>
                                                </li>
                                                <li className="mb-3">
                                                    <Link to="/mywishlist" className="ms-3 text-decoration-none fs-6">
                                                        <i className="fa-regular fa-heart"></i> Wishlist
                                                    </Link>
                                                </li>
                                                <li className="mb-3">
                                                    <Link to="/rewards" className="ms-3 text-decoration-none fs-6">
                                                        <i className="fa fa-gift"></i> Rewards
                                                    </Link>
                                                </li>
                                                <li className="mb-3 text-center">
                                                    <div className="row ms-2">
                                                        {localStorage.getItem("userid") === null ? (
                                                            <div className="col-xl-6 m-auto">
                                                                <Link>
                                                                    <button onClick={userLogin} className="btn btn-primary form-control custom-btndropdown">Login</button>
                                                                </Link>
                                                            </div>
                                                        ) : (
                                                            <div className="col-xl-6 m-auto">
                                                                <button className="btn btn-danger form-control custom-btndropdown" onClick={Logout}>Logout</button>
                                                            </div>
                                                        )}
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
                            <Link
                                type="button"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#demo"
                                className={`text-white text-decoration-none nav-category ${currentPath === '/all' ? 'active-link' : ''}`}
                            >
                                <i className="fa fa-list text-white me-2"></i> All
                            </Link>

                            <Link
                                to="/kids wear"
                                className={`text-white text-decoration-none nav-category ${currentPath === '/kids wear' ? 'active-link' : ''}`}
                            >
                                Kids Wear
                            </Link>

                            <Link
                                to="/mens wear"
                                className={`text-white text-decoration-none nav-category ${currentPath === '/mens wear' ? 'active-link' : ''}`}
                            >
                                Mens Wear
                            </Link>

                            <Link
                                to="/womens wear"
                                className={`text-white text-decoration-none nav-category ${currentPath === '/womens wear' ? 'active-link' : ''}`}
                            >
                                Womens Wear
                            </Link>

                            <Link
                                to="/bags"
                                className={`text-white text-decoration-none nav-category ${currentPath === '/bags' ? 'active-link' : ''}`}
                            >
                                Bags
                            </Link>

                            <Link
                                to="/head phones"
                                className={`text-white text-decoration-none nav-category ${currentPath === '/head phones' ? 'active-link' : ''}`}
                            >
                                Head Phones
                            </Link>

                            <Link
                                to="/mobiles"
                                className={`text-white text-decoration-none nav-category ${currentPath === '/mobiles' ? 'active-link' : ''}`}
                            >
                                Mobiles
                            </Link>

                            <Link
                                to="/laptops"
                                className={`text-white text-decoration-none nav-category ${currentPath === '/laptops' ? 'active-link' : ''}`}
                            >
                                Laptops
                            </Link>

                            <Link
                                to="/watches"
                                className={`text-white text-decoration-none nav-category ${currentPath === '/watches' ? 'active-link' : ''}`}
                            >
                                Watches
                            </Link>

                            <Link
                                to="/electronic gadgets"
                                className={`text-white text-decoration-none nav-category ${currentPath === '/electronic gadgets' ? 'active-link' : ''}`}
                            >
                                Elec-Goods
                            </Link>

                            <Link
                                to="/footwear"
                                className={`text-white text-decoration-none nav-category ${currentPath === '/footwear' ? 'active-link' : ''}`}
                            >
                                Footwear
                            </Link>

                            <Link
                                to="/shampoos"
                                className={`text-white text-decoration-none nav-category ${currentPath === '/shampoos' ? 'active-link' : ''}`}
                            >
                                Shampoos
                            </Link>

                            <Link
                                to="/moisturizers"
                                className={`text-white text-decoration-none nav-category ${currentPath === '/moisturizers' ? 'active-link' : ''}`}
                            >
                                Moisturizers
                            </Link>
                        </div>
                    </nav>
                </nav>



            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/home" element={<Home/>} />
                
                <Route path="/cartlist" element={ <Cartlist/> } />
                <Route path="/myprofile" element={ <Myprofile/> } />
                <Route path="/myorders" element= { <Myorders/> } />
                <Route path="/mywishlist" element= { <Mywishlist/> } />
                <Route path="/rewards" element={ <Rewards/> } />

                <Route path="/:category" element={ <Displaytype/> } /> 
                <Route path="/:searchvalue" element={ <Displaytype/> } /> 
                <Route path="/:category/:id" element= { <Displaysingle/> } />

                <Route path="*" element={<Navigate to="/home" replace />} />

            </Routes>




            <footer className="bg-dark text-white pt-5 pb-5">
                <div className="container">
                    <div className="row">
                        {/* Get to Know Us Section */}
                        <div className="col-4 m-auto mt-0">
                            <div className="m-auto">
                                <h5 className="text-warning mb-3">Get to Know Us</h5>
                                <p>Contact Us</p>
                                <p>Careers</p>
                                <p>About Us</p>
                                <p>Corporate Information</p>
                            </div>
                        </div>

                        {/* Connect With Us Section */}
                        <div className="col-3 m-auto mt-0">
                            <div className="m-auto">
                                <h5 className="text-warning mb-3">Connect With Us</h5>
                                <p>
                                    <a href="https://facebook.com" target="_blank" className="text-decoration-none text-white">
                                        <i className="fab fa-facebook me-2"></i> Facebook
                                    </a>
                                </p>
                                <p>
                                    <a href="https://twitter.com" target="_blank" className="text-decoration-none text-white">
                                        <i className="fab fa-twitter me-2"></i> Twitter
                                    </a>
                                </p>
                                <p>
                                    <a href="https://instagram.com" target="_blank" className="text-decoration-none text-white">
                                        <i className="fab fa-instagram me-2"></i> Instagram
                                    </a>
                                </p>
                                <p>
                                    <a href="https://www.linkedin.com/in/praveen-koneti/" target="_blank" className="text-decoration-none text-white">
                                        <i className="fab fa-linkedin me-2"></i> LinkedIn
                                    </a>
                                </p>
                            </div>
                        </div>

                        {/* Registered Office Address Section */}
                        <div className="col-5 m-auto mt-0">
                            <div className="m-auto">
                                <h5 className="text-warning mb-3">Registered Address</h5>
                                <p>
                                    Address: #118/119, 1st Cross, 3rd Main, Hemanth Nagar, Kalamandir Back Side, Marthahalli, Bangalore - 560037
                                    <br />
                                    <hr />
                                    Contact No: +91-7995171323 <br />
                                    E-Mail: kr19pravin@gmail.com
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>


            
            
        <div
            className="offcanvas offcanvas-start"
            id="demo"
            style={{
                backgroundColor: '#f8f9fa',
                color: '#343a40',
                padding: '20px',
                maxWidth: '75%',
            }}
        >
            <div className="offcanvas-header">
                <h1 className="offcanvas-title" style={{ fontWeight: 'bold' }}>SreeShop Menu</h1>
                <button
                    type="button"
                    className="btn-close btn-danger"
                    data-bs-dismiss="offcanvas"
                ></button>
            </div>
            <div className="offcanvas-body">
                <div style={{ marginBottom: '20px' }}>
                    <h5 style={{ fontWeight: 'bold' }}>Quick Links</h5>
                    <div className="row">
                        {[
                            { name: 'Home', icon: 'home' },
                            { name: 'My Profile', icon: 'user' },
                            { name: 'My Orders', icon: 'shopping-bag' },
                            { name: 'My Wishlist', icon: 'heart' }
                        ].map((link, index) => (
                            <div className="col-12 col-md-6 mb-2" key={index}>
                                <Link
                                    to={`/${link.name.toLowerCase().replace(' ', '')}`}
                                    className="d-block p-3 bg-light rounded text-center text-decoration-none shadow-sm"
                                    style={{ color: '#007bff' }}
                                >
                                    <i className={`fa fa-${link.icon} me-2`}></i> {link.name}
                                </Link>
                            </div>
                        ))}
                    </div>

                </div>

                <div style={{ marginBottom: '20px' }}>
                    <h5 style={{ fontWeight: 'bold' }}>Login / Signup</h5>
                    <div className="d-flex flex-column mt-2">
                        <Link
                            onClick={userLogin}
                            className="btn btn-primary btn-sm mb-2"
                            style={{ backgroundColor: '#007bff', border: 'none' }}
                        >
                            <i className="fa fa-user me-2"></i> Login
                        </Link>
                        <Link
                            onClick={userSignup}
                            className="btn btn-success btn-sm"
                            style={{ backgroundColor: '#28a745', border: 'none' }}
                        >
                            <i className="fa fa-user-plus me-2"></i> Sign Up
                        </Link>
                    </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <h5 style={{ fontWeight: 'bold' }}>Contact Us</h5>
                    <p>If you have any questions, feel free to reach out!</p>
                    <p>Email: <a href="mailto:kr19pravin@gmail.com" style={{ textDecoration: 'none' }}>kr19pravin@gmail.com</a></p>
                    <p>Contact No: <strong>+91-7995171323</strong></p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <h5 style={{ fontWeight: 'bold' }}>Follow Us</h5>
                    <div className="row text-center">
                        {/* LinkedIn Icon */}
                        <div className="col-3 mb-2">
                            <a href="https://www.linkedin.com/in/praveen-koneti/" target="_blank" className="text-decoration-none">
                                <i className="fab fa-linkedin fa-2x" style={{ color: '#007bff' }}></i>
                            </a>
                        </div>
                        
                        {/* Twitter Icon */}
                        <div className="col-3 mb-2">
                            <a href="https://twitter.com" target="_blank" className="text-decoration-none">
                                <i className="fab fa-twitter fa-2x" style={{ color: '#1da1f2' }}></i>
                            </a>
                        </div>
                        
                        {/* Facebook Icon */}
                        <div className="col-3 mb-2">
                            <a href="https://facebook.com" target="_blank" className="text-decoration-none">
                                <i className="fab fa-facebook fa-2x" style={{ color: '#1877f2' }}></i>
                            </a>
                        </div>
                        
                        {/* Instagram Icon */}
                        <div className="col-3 mb-2">
                            <a href="https://instagram.com" target="_blank" className="text-decoration-none">
                                <i className="fab fa-instagram fa-2x" style={{ color: '#e4405f' }}></i>
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </div>


        </>
    )
}

export default Adminapp;


const userLogin = () => {
    localStorage.setItem("userloginpermission", true);
    const sellerPageUrl = "/userlogin"; // Replace with your seller page URL
    window.open(sellerPageUrl, "_blank");
}


const userSignup = () => {
    localStorage.setItem("usersignuppermission", true);
    const sellerPageUrl = "/usersignup"; // Replace with your seller page URL
    window.open(sellerPageUrl, "_blank");
}



const Logout = () =>
{
    localStorage.clear();
    window.location.reload();
}

const Sellerpage = () => {
    localStorage.setItem("SreeShoppermit", "sellerlogin");
    //window.location.reload();
    const sellerPageUrl = "/becomeseller"; // Replace with your seller page URL
    window.open(sellerPageUrl, "_blank");
    
}
