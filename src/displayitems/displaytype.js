import { useState, useEffect, useRef } from "react";
import { Link, Navigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import swal from "sweetalert";
import { deleteData, fetchData, postData } from "../Api/apihandler";
import { config } from "../config";
import { Paginator } from 'primereact/paginator';
import { Toast } from 'primereact/toast'; // Import Toast component


const Displaytype = () => {
    let { category } = useParams();
    let [searchcategoryname, searchbrandname] = category.split('-');
    let [islogin, setislogin] = useState(true);
    let [brandname, setbrandname] = useState("");
    let [brandlist, setbrandlist] = useState([]);
    let [items, pickitems] = useState([]);
    const [itemsCount, setItemsCount] = useState(0); // Total item count
    const [first, setFirst] = useState(0); // First record index
    const [rows, setRows] = useState(10); // Rows per page

    const toastRef = useRef(null); // Create a ref for the toast

    const showToast = (severity, detail, isLoading = false) => {
        const content = (
            <div className="d-flex flex-column align-items-start">
                {isLoading && <span className="spinner-border me-2" role="status"></span>}
                <span>{detail}</span>
            </div>
        );
        toastRef.current.show({ severity, summary: null, detail: content });
    };

    const addwishlist = async (product, status) => {
        if (localStorage.getItem("userid") != null) {
            showToast('info', 'Adding product in Wishlist...', true); // Show loading toast
            if (status === "add") {
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
                let messageinfo = await postData(config.savewishlist, newwishlist);
                toastRef.current.clear();
                if (messageinfo && messageinfo !== "") {
                    swal(messageinfo.message, "", "success")
                        .then(() => {
                            getdata(0, rows); // Update data on adding to wishlist
                        });
                } else {
                    swal("Internal Server Error", "", "warning");
                }
            } else {
                let response = await deleteData(`${config.deletewishlist}/${product.wishlistId}`);
                if (response && response.message !== "") {
                    swal(response.message, '', "success")
                        .then(() => {
                            getdata(0, rows); // Update data on wishlist removal
                        });
                } else {
                    swal("Internal Server Error", "", "warning");
                }
            }
        } else {
            swal("Please Login / Signup", "You have Account Login / Signup", "warning")
                .then(() => {
                    setislogin(false);
                });
        }
    };

    const addcart = async (product) => {
        if (localStorage.getItem("userid") != null) {
            showToast('info', 'Adding product in Cartlist...', true); // Show loading toast
            if (product.productactive === "In Stock") {
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
                let response = await postData(config.savecartlist, newcartdata);
                toastRef.current.clear();
                if (response.message === "yes") {
                    swal("Added to Cart Successfully", "", "success")
                        .then(() => {
                            getdata(first, rows); // Update data on cart addition
                        });
                } else {
                    swal("This Product Already Existed in Cart", "", "warning");
                }
            } else {
                swal("Out Of Stock", "Product out of stock, buy after some time", "warning");
            }
        } else {
            swal("Please Login / Signup", "You have Account Login / Signup", "warning")
                .then(() => {
                    setislogin(false);
                });
        }
    };

    const handleBrandChange = (brand) => {
        setbrandname(brand === brandname ? "" : brand);
        getbrandproducts(0, rows, brand);
    };

    const getbrandproducts = async (first, rows, brand) => {
        let response = await fetchData(`${config.getparticularbrandproduct}?brand=${brand}&category=${searchcategoryname}&skip=${first}&limit=${rows}`);
        pickitems(response.products);
        setItemsCount(response.total);
    };

    const getdata = async (first, rows) => {
        showToast('info', 'Fetching products...', true); // Show loading toast
        let response = await fetchData(`${config.getproducts}?searchcategoryname=${searchcategoryname}&searchbrandname=${searchbrandname ? searchbrandname : null}&skip=${first}&limit=${rows}&user=${localStorage.getItem("userid")}`);
        pickitems(response.products);
        setbrandlist(response.brands);
        setItemsCount(response.total);
        toastRef.current.clear(); // Clear the toast  // Adjust the duration as needed (2000 ms = 2 seconds)
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

    if (!islogin) {
        return <Navigate to="/userlogin" />;
    }

    return (
        <div className="container">
            <Toast ref={toastRef} position="center" /> {/* Include the Toast component */}
            <div className="row mt-4">
                <div className="col-4 ms-auto me-auto">
                    <div className="row shadow-lg p-2 pb-3 pt-2 custom-brandnames">
                        <h3 className="text-center"> Brands </h3>
                        <div className="col-xl-12 brandnames-scroll">
                            {brandlist.map((brand, index) => (
                                <div className="row form-check" key={index}>
                                    <h5 className="mb-3">
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
                                        <p className="mb-2" style={{ color: product.productactive === "In Stock" ? "green" : "red" }}>
                                            <b>{product.productactive}</b>
                                        </p>
                                        {product.productactive === 'In Stock' && (
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


                <div className="paginator-container mt-3">
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
