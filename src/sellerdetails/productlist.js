import { useEffect, useState } from "react";
import swal from "sweetalert";
import ReactPaginate from "react-paginate";
import { Paginator } from 'primereact/paginator';

import Editproduct from "./editproduct";
import Deleteproduct from "./deleteproduct";
import { fetchData, putData } from "../Api/apihandler";
import { config } from "../config";

const Myproductlist = () => {
    let [productlist, pickproductlist] = useState([]);
    let [filterkey, pickfilterkey] = useState("");
    let [viewproduct, pickviewproduct] = useState({});

    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [itemsCount, setItemsCount] = useState(0);

    const handlePagination = (event) =>{
        setFirst(event.first);
        setRows(event.rows);
        getproducts(event.first, event.rows);
    }

    const handleproductactive = async(productactive, id, name) => {
        let active = productactive === "In Stock" ? "Out Of Stock" : "In Stock";
         let updatestock = { id: id, active: active };
        await putData(`${config.updatestock}/${id}`, updatestock)
        .then(res => {
            swal(res.message, name, "success")
                .then(() => {
                    getproducts();
                })
        })
    }

    const getproducts = async(skip=0, limit=10) => {
        console.log(skip,"   ", limit);
        await fetchData(`${config.getsellerproduct}?sellerid=${localStorage.getItem("sellerid")}&skip=${skip}&limit=${limit} `)
        .then(res => {
            pickproductlist(res.product.reverse());
            setItemsCount(res.productsCount);
            
        })
    }
    

    useEffect(() => {
            getproducts();
    }, []);

    const PER_PAGE = 12;
    const [currentPage, setCurrentPage] = useState(0);
    function handlePageClick({ selected: selectedPage }) {
        setCurrentPage(selectedPage)
    }
    const offset = currentPage * PER_PAGE;
    const pageCount = Math.ceil(productlist.length / PER_PAGE);

    const updateProductList = (updatedProduct) => {
        const updatedList = productlist.map((product) => 
            product._id === updatedProduct._id ? updatedProduct : product
        );
        pickproductlist(updatedList);
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-12 m-auto">
                    <div className="col-6 m-auto mb-3">
                        <div className="row">
                            <div className="col-8">
                                <div className="input-group">
                                    <span className="input-group-text bg-warning "> <i className="fa fa-search"></i></span>
                                    <input type="text" className="form-control shadow-none" placeholder="Search here..." onChange={obj => pickfilterkey(obj.target.value)} value={filterkey} />
                                </div>
                            </div>
                            <div className="col-4">
                                <button onClick={() => pickfilterkey("")} className="btn btn-danger"> Reset Filter </button>
                            </div>
                        </div>
                    </div>
                    <h3 className="text-center text-primary mb-3"> Total products : {itemsCount} </h3>
                    <div className="table-responsive">
                        <table className="table table-bordered text-center table-striped  table-hover">
                            <thead className="sticky-top fs-5 pt-2 pb-2">
                                <tr>
                                    <th className="bg-black text-white"> Product </th>
                                    <th className="bg-black text-white"> Name </th>
                                    <th className="bg-black text-white"> Price </th>
                                    <th className="bg-black text-white"> Brand </th>
                                    <th className="bg-black text-white"> Active </th>
                                    <th className="bg-black text-white"> Edit </th>
                                    <th className="bg-black text-white"> Delete </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    productlist.slice(offset, offset + PER_PAGE).map((product, index) => {
                                        if (product.productname.toLowerCase().match(filterkey.toLowerCase()) || product.brandname.toLowerCase().match(filterkey.toLowerCase()))
                                            return (
                                                <tr key={index}>
                                                    <td> <img src={`${config.host}/productimages/${product.productimage}`} width="60" height="60" className="sellerorder" data-bs-toggle="modal" data-bs-target="#myModal" /> </td>
                                                    <td data-bs-toggle="modal" data-bs-target="#myModal" onClick={()=>{pickviewproduct(product)}} style={{ width: '600px', textAlign: 'left' }}> {product.productname} </td>
                                                    <td> {product.productprice} </td>
                                                    <td> {product.brandname.toUpperCase()} </td>
                                                    <td className="text-center justify-content-center"> 
                                                        <div className="text-center justify-content-center">
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" id="mySwitch" name="productactive" value={product.productactive} checked={product.productactive === "In Stock"} onChange={handleproductactive.bind(this, product.productactive, product._id, product.productname)} />
                                                                <label className="form-check-label" htmlFor="mySwitch" style={{ color: product.productactive === "Out Of Stock" ? 'red' : 'green' }}>
                                                                    <b> {product.productactive} </b>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td> <Editproduct productdata={product} updateProductList={updateProductList} /> </td>
                                                    <td> <Deleteproduct id={product._id} name={product.productname} /> </td>
                                                </tr>
                                            )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>

                <Paginator first={first} rows={rows} totalRecords={itemsCount} rowsPerPageOptions={[10, 25, 50, 100]} onPageChange={handlePagination} /> 
            </div>

            <div class="modal" id="myModal">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">

                    
                    <div class="modal-header">
                        <h2 class="modal-title text-primary m-auto"> Product Description</h2>
                    </div>

                    <div class="modal-body">
                        <div className="row mb-4">
                            <div className="col-3 m-auto">
                                <img src={`${config.host}/productimages/${viewproduct.productimage}`} width={200} height={200} alt="Product" />
                            </div>
                            </div>
                        
                            <div className="row mb-3">
                                <div className="col-4"> <h6>Product Name</h6> </div>
                                <div className="col-8"> <p> {viewproduct.productname} </p> </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-4"> <h6>Product Price</h6> </div>
                                <div className="col-8"> <p> {viewproduct.productprice} </p> </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-4"> <h6>Brand Name</h6> </div>
                                <div className="col-8"> <p> {viewproduct.brandname} </p> </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-4"> <h6>Category Name</h6> </div>
                                <div className="col-8"> <p> {viewproduct.categoryname} </p> </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-4"> <h6>Product Active</h6> </div>
                                <div className="col-8"> <p> {viewproduct.productactive} </p> </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-4"> <h6>Product Description</h6> </div>
                                <div className="col-8"> <p> {viewproduct.productdescription} </p> </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-4"> <h6>Product URL</h6> </div>
                                <div className="col-8"> <p> {viewproduct.producturl} </p></div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-4"> <h6>Product Image</h6> </div>
                                <div className="col-8"> <p> {viewproduct.productimage} </p> </div>
                            </div>
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger m-auto" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default Myproductlist;
