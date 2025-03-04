import { useState, useEffect, useRef } from "react";
import { Link, Navigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { deleteData, fetchData, postData } from "../Api/apihandler";
import { config } from "../config";
import { Paginator } from 'primereact/paginator';
import { Toast } from 'primereact/toast'; // Import Toast component


const Displaytype = () => {
    let { category } = useParams();
    let [searchcategoryname, searchbrandname] = category.split('-');
    let [brandname, setbrandname] = useState("");
    let [brandlist, setbrandlist] = useState([]);
    let [items, pickitems] = useState([]);
    const [itemsCount, setItemsCount] = useState(0); // Total item count
    const [first, setFirst] = useState(0); // First record index
    const [rows, setRows] = useState(10); // Rows per page

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
    
    





    const addwishlist = async (product, status) => {
        if (localStorage.getItem("userid") != null) {
            if (status === "add") {
                showToast('info', 'Adding product in Wishlist', true); // Show loading toast
                let newwishlist = {
                    userid: localStorage.getItem("userid"),
                    productid: product._id,
                    brandname: product.brandname,
                    sellerid:  product.sellerid,
                    categoryname: product.categoryname,
                    productname: product.productname,
                    productprice: product.productprice,
                    productactive: product.productactive,
                    productimage: product.productimage
                };
                await postData(config.savewishlist, newwishlist)
                .then(messageinfo =>{
                    toastRef.current.clear();
                    if (messageinfo && messageinfo !== "") {
                        showToast("success",messageinfo.message)
                        setTimeout(() => {
                            getdata(0, rows); // Update data on adding to wishlist
                        }, 1500);
                    } else {
                        showToast("warn","Internal Server Error");
                    }
                } ) 
            } else {
                showToast('info', 'Removing product from Wishlist', true); // Show loading toast
                await deleteData(`${config.deletewishlist}/${product.wishlistId}`)
                .then(response =>{
                    toastRef.current.clear();
                    if (response && response.message !== "") {
                        showToast("success",response.message)
                        setTimeout(() => {
                            getdata(0, rows); // Update data on wishlist removal
                        }, 1500);       
                        
                    } else {
                        showToast("error","Internal Server Error");
                    }
                })  
            }
        } else {
            showToast("warn","You have Account Please Login ",false,"Please Login / Signup")
        }
    };




                // ADD THE CART HERE

    const addcart = async (product) => {
        if (localStorage.getItem("userid") != null) 
        {
            if (product.productactive === "InStock") 
            {
                showToast('info', 'Adding product in Cartlist', true); // Show loading toast
                let newcartdata = {
                    userid: localStorage.getItem("userid"),
                    productid: product._id,
                    sellerid: product.sellerid,
                    brandname: product.brandname,
                    categoryname: product.categoryname,
                    productname: product.productname,
                    productprice: product.productprice,
                    productquantity: 1,
                    productactive: product.productactive,
                    productimage: product.productimage
                };
                await postData(config.savecartlist, newcartdata)
                .then(response => {
                    toastRef.current.clear();
                    if (response.message === "yes") {
                        showToast("success","Added to Cart Successfully")
                        setTimeout(() => {
                            getdata(first, rows); // Update data on cart addition
                        }, 1500);
                    } else {
                        showToast("warn","This Product Already Existed in Cart");
                    }
                })
            } 
            else 
                showToast("warn", "Product out of stock, buy after some time",false,"Out Of Stock");
        } 
        else 
            showToast("warm", "You have Account Login / Signup",false,"Please Login / Signup")
    };

    const handleBrandChange = (brand) => {
        setbrandname(brand === brandname ? "" : brand);
        getbrandproducts(0, rows, brand === brandname ? "" : brand);
    };

    const getbrandproducts = async (first, rows, brand) => {
        showToast('info', 'Fetching products', true); // Show loading toast
        await fetchData(`${config.getparticularbrandproduct}?brand=${brand}&category=${searchcategoryname}&skip=${first}&limit=${rows}`)
        .then(response => {
            pickitems(response.products);
            setItemsCount(response.total);
            toastRef.current.clear(); // Clear the toast  // Adjust the duration as needed (2000 ms = 2 seconds)
        })
        
    };

    const getdata = async (first, rows) => {
        showToast('info', 'Fetching products', true); // Show loading toast
        await fetchData(`${config.getproducts}?searchcategoryname=${searchcategoryname}&searchbrandname=${searchbrandname ? searchbrandname : null}&skip=${first}&limit=${rows}&user=${localStorage.getItem("userid")}`)
        .then(response => {
            pickitems(response.products);
            setbrandlist(response.brands);
            setItemsCount(response.total);
            toastRef.current.clear(); // Clear the toast  // Adjust the duration as needed (2000 ms = 2 seconds)
        })
        
    };

    // Pagination event handler
    const onPageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
        if (brandname === "") {
            getdata(event.first, event.rows);
        } else {
            getbrandproducts(event.first, event.rows, brandname);
        }
    };

    useEffect(() => {
        getdata(0, rows);
    }, [category, searchcategoryname, searchbrandname]);


    return (
        <div className="container-fluid">
            <Toast ref={toastRef} position="center" className="custom-toast" />{/* Include the Toast component */}
            <div className="row mt-4">
                <div className="col-4">
                    <div className="shadow-lg">
                        <h3 className="text-center bg-dark text-white pt-1 pb-1"> Brands </h3>
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 ps-4 pt-2 brandnames-scroll custom-brandnames">
                            {brandlist.map((brand, index) => (
                                <div className="row form-check" key={index}>
                                    <h5 className="mb-3 brandnames">
                                        <input type="radio" className="form-check-input" name="brandname"
                                            onClick={() => handleBrandChange(brand)}
                                            value={brand}
                                            checked={brandname === brand}
                                        />
                                        {brand}
                                    </h5>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="col-8 ms-auto me-auto custom-displaytypeproducts">
                    <div className="row">
                        {items.map((product, index) => (
                            <div className="col-sm-12 col-lg-12 mb-2" key={index}>
                                <div className="row p-1 m-auto">
                                    <div className="row ps-2 pb-2">
                                        { product.isInWishlist ?
                                            (<i className="fa-solid fa-heart text-danger text-start fs-5"
                                                    onClick={addwishlist.bind(this, product, "delete", product.wishlistId)} >                                                                 
                                            </i>)
                                            :
                                            (<i className="fa-regular fa-heart text-start fs-5" onClick={addwishlist.bind(this, product, "add")}></i>)
                                        }      
                                    </div>
                                    <div className="col-sm-3 text-center">
                                        <Link to={`/${product.categoryname}/${product.producturl}`}>
                                            <img 
                                                src={`${config.host}/productimages/${product.productimage}`} 
                                                alt={product.productname} 
                                                width="100%" 
                                                height="200" 
                                                className="custom-img" 
                                            />
                                        </Link>
                                    </div>
                                    <div className="col-sm-8 m-auto">
                                        <h5 className="mt-3"><b>{product.productname}</b></h5>
                                        <h5 className="mt-3">Rs. {product.productprice} /__</h5>
                                        <p className="m-0">Brand Name <i className="fa fa-tags icon-class"></i>: <b className="text-primary">{product.brandname.toUpperCase()}</b></p>
                                        <p className="mb-2" style={{ color: product.productactive === "InStock" ? "green" : "red" }}>
                                            <b>{product.productactive}</b>
                                        </p>
                                        {product.productactive === 'InStock' && (
                                            <span  className="text-white p-2 ps-2 pe-2 productoffer" style={{ borderRadius: "50%", background: 'red' }}>
                                                Rs {Math.round(product.productprice * 0.05)} off /__ {/* 5% off */}
                                            </span>
                                        )}
                                        <div className="text-center col-sm-4 mt-2 mb-2">
                                            <button className="btn btn-warning mt-2 form-control responsive-button" onClick={addcart.bind(this, product)}>
                                                <i className="fa fa-shopping-cart me-1"></i> Add Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <hr style={{
                                    border: 'none',
                                    height: '3px', // Adjust thickness
                                    backgroundColor: 'black', // Change this to your desired color
                                    margin: '20px 0', // Adjust spacing as needed
                                    width: '100%' // Full width
                                }} />
                            </div>
                        ))}
                    </div>
                </div>


                <div className="paginator-container mt-3 mb-3">
                    <Paginator
                        first={first}
                        rows={rows}
                        totalRecords={itemsCount}
                        rowsPerPageOptions={[10, 25, 50, 100]}
                        onPageChange={onPageChange}
                        pageLinkSize={3} // This limits the number of page links displayed
                    />
                </div>
            </div>
        </div>
    );
}

export default Displaytype;
