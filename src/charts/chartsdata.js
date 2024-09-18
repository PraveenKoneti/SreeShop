
// import { useState } from "react"
// import ReactPaginate from "react-paginate"
// import swal from "sweetalert";
// import { useLocation } from "react-router-dom";

// import Editproduct from "../sellerdetails/editproduct";
// import Deleteproduct from "../sellerdetails/deleteproduct";

// const Chartsdata = () =>{

//     let [filterkey, pickfilterkey] = useState("");
//     let [viewproduct, pickviewproduct] = useState({});

//     const location = useLocation();
//     const { productlist } = location.state || {};

//     const handleproductactive = (productactive, id, name) => {
//         let active = productactive === "In Stock" ? "Out Of Stock" : "In Stock";

//         let url = "http://localhost:7777/product/updatestock";
//         let updatestock = { id: id, active: active };
//         let postdata = {
//             headers: { "Content-Type": "application/json" },
//             method: "post",
//             body: JSON.stringify(updatestock)
//         }

//         fetch(url, postdata)
//             .then(res => res.json())
//             .then(res => {
//                 swal(res.message, name, "success")
//                     .then(() => {
//                         getproducts();
//                     })
//             })
//     }

//     const getproducts = () => {
//         let url = "http://localhost:7777/product/getsellerproduct";
//         let postData = {
//             headers: { "Content-Type": "application/json" },
//             method: "post",
//             body: JSON.stringify({ sellerid: localStorage.getItem("sellerid") })
//         }
//         fetch(url, postData)
//             .then(res => res.json())
//             .then(res => {
//                 pickproductlist(res.reverse());
//             })
//     }



//     const PER_PAGE = 12;
//     const [currentPage, setCurrentPage] = useState(0);
//     function handlePageClick({ selected: selectedPage }) {
//         setCurrentPage(selectedPage)
//     }
//     const offset = currentPage * PER_PAGE;
//     const pageCount = Math.ceil(productlist.length / PER_PAGE);

//     const updateProductList = (updatedProduct) => {
//         const updatedList = productlist.map((product) => 
//             product._id === updatedProduct._id ? updatedProduct : product
//         );
//         pickproductlist(updatedList);
//     }



//     return(
//         <div className="container">
//             <div className="row">
//                 <div className="col-sm-12 m-auto">
//                     <div className="col-6 m-auto mb-3">
//                         <div className="row">
//                             <div className="col-8">
//                                 <div className="input-group">
//                                     <span className="input-group-text bg-warning "> <i className="fa fa-search"></i></span>
//                                     <input type="text" className="form-control shadow-none" placeholder="Search here..." onChange={obj => pickfilterkey(obj.target.value)} value={filterkey} />
//                                 </div>
//                             </div>
//                             <div className="col-4">
//                                 <button onClick={() => pickfilterkey("")} className="btn btn-danger"> Reset Filter </button>
//                             </div>
//                         </div>
//                     </div>
//                     <h3 className="text-center text-primary mb-3"> Total products : {productlist.length} </h3>
//                     <div className="table-responsive" style={{ height: '500px', overflow: "auto" }}>
//                         <table className="table table-bordered text-center table-striped  table-hover">
//                             <thead className="sticky-top fs-5 pt-2 pb-2">
//                                 <tr>
//                                     <th className="bg-black text-white"> Product </th>
//                                     <th className="bg-black text-white"> Name </th>
//                                     <th className="bg-black text-white"> Price </th>
//                                     <th className="bg-black text-white"> Brand </th>
//                                     <th className="bg-black text-white"> Active </th>
//                                     <th className="bg-black text-white"> Edit </th>
//                                     <th className="bg-black text-white"> Delete </th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {
//                                     productlist.slice(offset, offset + PER_PAGE).map((product, index) => {
//                                         if (product.productname.toLowerCase().match(filterkey.toLowerCase()) || product.brandname.toLowerCase().match(filterkey.toLowerCase()))
//                                             return (
//                                                 <tr key={index}>
//                                                     <td> <img src={`http://127.0.0.1:5500/backend%20mongodb/productimages/${product.productimage}`} width="60" height="60" className="sellerorder" data-bs-toggle="modal" data-bs-target="#myModal" /> </td>
//                                                     <td data-bs-toggle="modal" data-bs-target="#myModal" onClick={()=>{pickviewproduct(product)}} style={{ width: '600px', textAlign: 'left' }}> {product.productname} </td>
//                                                     <td> {product.productprice} </td>
//                                                     <td> {product.brandname.toUpperCase()} </td>
//                                                     <td>
//                                                         <div className="form-check form-switch">
//                                                             <input className="form-check-input" type="checkbox" id="mySwitch" name="productactive" value={product.productactive} checked={product.productactive === "In Stock"} onChange={handleproductactive.bind(this, product.productactive, product._id, product.productname)} />
//                                                             <label className="form-check-label" htmlFor="mySwitch" style={{ color: product.productactive === "Out Of Stock" ? 'red' : 'green' }}>
//                                                                 <b> {product.productactive} </b>
//                                                             </label>
//                                                         </div>
//                                                     </td>
//                                                     <td> <Editproduct productdata={product} updateProductList={updateProductList} /> </td>
//                                                     <td> <Deleteproduct id={product._id} name={product.productname} /> </td>
//                                                 </tr>
//                                             )
//                                     })
//                                 }
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//                 <div className="mb-4 mt-4 col-sm-10 m-auto p-0 m-0">
//                     <ReactPaginate
//                         previousLabel={"Previous"}
//                         nextLabel={"Next"}
//                         breakLabel={"..."}
//                         pageCount={pageCount}
//                         marginPagesDisplayed={2}
//                         pageRangeDisplayed={3}
//                         onPageChange={handlePageClick}
//                         containerClassName={"pagination  justify-content-center"}
//                         pageClassName={"page-item "}
//                         pageLinkClassName={"page-link"}
//                         previousClassName={"page-item"}
//                         previousLinkClassName={"page-link"}
//                         nextClassName={"page-item"}
//                         nextLinkClassName={"page-link"}
//                         breakClassName={"page-item"}
//                         breakLinkClassName={"page-link"}
//                         activeClassName={"active primary"}
//                     />
//                 </div>
//             </div>

//             <div class="modal" id="myModal">
//                 <div class="modal-dialog modal-lg">
//                     <div class="modal-content">

                    
//                     <div class="modal-header">
//                         <h2 class="modal-title text-primary m-auto"> Product Description</h2>
//                     </div>

//                     <div class="modal-body">
//                         <div className="row mb-4">
//                             <div className="col-3 m-auto">
//                                 <img src={`http://127.0.0.1:5500/backend%20mongodb/productimages/${viewproduct.productimage}`} width={200} height={200} alt="Product" />
//                             </div>
//                             </div>
                        
//                             <div className="row mb-3">
//                                 <div className="col-4"> <h6>Product Name</h6> </div>
//                                 <div className="col-8"> <p> {viewproduct.productname} </p> </div>
//                             </div>
//                             <div className="row mb-3">
//                                 <div className="col-4"> <h6>Product Price</h6> </div>
//                                 <div className="col-8"> <p> {viewproduct.productprice} </p> </div>
//                             </div>
//                             <div className="row mb-3">
//                                 <div className="col-4"> <h6>Brand Name</h6> </div>
//                                 <div className="col-8"> <p> {viewproduct.brandname} </p> </div>
//                             </div>
//                             <div className="row mb-3">
//                                 <div className="col-4"> <h6>Category Name</h6> </div>
//                                 <div className="col-8"> <p> {viewproduct.categoryname} </p> </div>
//                             </div>
//                             <div className="row mb-3">
//                                 <div className="col-4"> <h6>Product Active</h6> </div>
//                                 <div className="col-8"> <p> {viewproduct.productactive} </p> </div>
//                             </div>
//                             <div className="row mb-3">
//                                 <div className="col-4"> <h6>Product Description</h6> </div>
//                                 <div className="col-8"> <p> {viewproduct.productdescription} </p> </div>
//                             </div>
//                             <div className="row mb-3">
//                                 <div className="col-4"> <h6>Product URL</h6> </div>
//                                 <div className="col-8"> <p> {viewproduct.producturl} </p></div>
//                             </div>
//                             <div className="row mb-3">
//                                 <div className="col-4"> <h6>Product Image</h6> </div>
//                                 <div className="col-8"> <p> {viewproduct.productimage} </p> </div>
//                             </div>
//                         </div>

//                         <div class="modal-footer">
//                             <button type="button" class="btn btn-danger m-auto" data-bs-dismiss="modal">Close</button>
//                         </div>
//                     </div>
//                 </div>
//             </div>


//         </div>

//     )

// }

// export default Chartsdata;