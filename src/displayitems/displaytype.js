import { useState, useEffect, useRef } from "react";
import { Link, Navigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import ReactPaginate from "react-paginate";
import swal from "sweetalert";
import { deleteData, fetchData, postData } from "../Api/apihandler";
import { config } from "../config";

const Displaytype = () => {
    let { category } = useParams();
    let [searchcategoryname, searchbrandname] = category.split('-');
    let [islogin, setislogin] = useState(true);
    let [brandname, setbrandname] = useState("");
    let [brandlist, setbrandlist] = useState([]);
    let [items, pickitems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const PER_PAGE = 5;
    const [currentPage, setCurrentPage] = useState(1);

    const addwishlist = async(product, status) => {
        if (localStorage.getItem("userid") != null) {
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
                let messageinfo = await postData(config.savewishlist, newwishlist)
                if(messageinfo && messageinfo !== "")
                {
                    swal(messageinfo.message, "", "success")
                    .then(() => {
                        getdata(1);
                    });
                }
                else 
                    swal("Internal Server Error","","warning");
            } 
            else {
                let response = await deleteData(`${config.deletewishlist}/${product.wishlistId}`)
                if(response && response.message !== "")
                {
                    swal(response.message, '', "success")
                    .then(() => {
                        getdata(1);
                    });
                }
                else 
                    swal("Internal Server Error","","warning");
            }
        } else {
            swal("Please Login / Signup", "You have Account Login / Signup", "warning")
                .then(() => {
                    setislogin(false);
                });
        }
    };

    const addcart = async(product) => {
        if (localStorage.getItem("userid") != null) {
            if(product.productactive === "In Stock" ){
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
                let response = await postData(config.savecartlist, newcartdata)
                if (response.message === "yes") {
                    swal("Added to Cart Successfully", "", "success")
                        .then(() => {
                            getdata(1);
                        });
                } else {
                    swal("This Product Already Existed in Cart", "", "warning");
                }
            }
            else
                swal("Out Of Stock","Product out of stock, buy after some time","warning");
        } else {
            swal("Please Login / Signup", "You have Account Login / Signup", "warning")
                .then(() => {
                    setislogin(false);
                });
        }
    };

    const handleBrandChange = (brand) => {
        if (brandname === brand) {
            setbrandname("");
            setCurrentPage(1);
            getdata(1);
        } else {
            setbrandname(brand);
            setCurrentPage(1);
            getbrandproducts(1, brand);
        }
    };

    const getbrandproducts = async(page, brand) => {
        let response = await fetchData(`${config.getparticularbrandproduct}?brand=${brand}&category=${searchcategoryname}&page=${page}&limit=${PER_PAGE}`)
        pickitems(response.products);
        setPageCount(response.pages);
    }

    const getdata = async(page) => {
        let response = await fetchData(`${config.getproducts}?searchcategoryname=${searchcategoryname}&searchbrandname=${searchbrandname?searchbrandname:null}&page=${page}&limit=${PER_PAGE}&user=${localStorage.getItem("userid")}`)
        pickitems(response.products);
        setbrandlist(response.brands);
        setPageCount(response.pages);
        setbrandname("");
        
    };

    const handlePageClick = ({ selected: selectedPage }) => {
        setCurrentPage(selectedPage+1);
        if (brandname === "")
            getdata(selectedPage+1);
        else
            getbrandproducts(selectedPage+1, brandname);
    };

    useEffect(() => {setCurrentPage(1);getdata(1);}, [category,searchcategoryname, searchbrandname]);


    if (!islogin) {
        return <Navigate to="/SreeShop/userlogin" />;
    }

    return (
        <div className="container">
            <div className="row mt-4">
                <div className="col-4 ms-auto me-auto">
                    <div className="row shadow-lg p-2 pb-3 pt-2 custom-brandnames">
                        <h3 className="text-center"> Brands </h3>
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xxl-12 brandnames-scroll">
                            {
                                brandlist.map((brand, index) => {
                                    return (
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
                                    );
                                })
                            }
                        </div>
                    </div>
                </div>

                <div className="col-8 ms-auto me-auto custom-displaytypeproducts">
                    <div className="row">
                        {
                            items.map((products, index) => {
                                return (
                                    <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12 mb-4" key={index}>
                                        <div className="row shadow-lg p-1 m-auto">
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    { products.isInWishlist ?
                                                        (<i className="fa-solid fa-heart text-danger text-start"
                                                            onClick={addwishlist.bind(this, products, "delete", )}>
                                                        </i>)
                                                        :
                                                        (<i className="fa-regular fa-heart text-start" onClick={addwishlist.bind(this, products, "add")}></i>)
                                                    }
                                                </div>
                                            </div>
                                            <div className="col-sm-3 text-center">
                                                <Link to={`/SreeShop/${products.categoryname}/${products.producturl}`}>
                                                    <img src={`${config.host}/productimages/${products.productimage}`} alt={products.name} width="100%" height="200" className="custom-img" />
                                                </Link>
                                            </div>
                                            <div className="col-sm-8 m-auto">
                                                <h5 className=" mt-3"> <b>{products.productname}</b> </h5>
                                                <h5 className=" mt-3"> Rs. {products.productprice} /__</h5>
                                                <p className="m-0">Brand Name <i className="fa fa-tags icon-class"></i> : <b className="text-primary"> {products.brandname.toUpperCase()}</b> </p>
                                                <div>
                                                    {
                                                        products.productactive === "In Stock" ?
                                                            (<p className="text-white m-0 col-3 p-1 text-center productoffer" style={{ background: 'red', borderRadius: '50%' }}> <b> Rs</b> {(products.productprice * 0.06).toFixed(0)} off</p>)
                                                            : ''
                                                    }
                                                </div>
                                                <p className="m-0" style={{ color: products.productactive === "In Stock" ? "green" : "red" }}> <b>{products.productactive}</b> </p>
                                                <div className="text-center col-sm-4 mb-2 mt-1"> <button className="btn btn-warning mt-2 form-control responsive-button" onClick={addcart.bind(this, products)}> <i className="fa fa-shopping-cart me-1"></i> Add Cart </button></div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>

                <div className="mb-4 mt-4 col-sm-10 m-auto p-0 m-0">
                    <ReactPaginate
                        previousLabel={"Previous"}
                        nextLabel={"Next"}
                        breakLabel={"..."}
                        pageCount={pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={3}
                        onPageChange={handlePageClick}
                        containerClassName={"pagination  justify-content-center"}
                        pageClassName={"page-item "}
                        pageLinkClassName={"page-link"}
                        previousClassName={"page-item"}
                        previousLinkClassName={"page-link"}
                        nextClassName={"page-item"}
                        nextLinkClassName={"page-link"}
                        breakClassName={"page-item"}
                        breakLinkClassName={"page-link"}
                        activeClassName={"active primary"}
                        forcePage={currentPage - 1}
                    />
                </div>
            </div>
        </div>
    );
}

export default Displaytype;
