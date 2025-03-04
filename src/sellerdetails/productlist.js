import { useEffect, useState } from "react";
import swal from "sweetalert";
import ReactPaginate from "react-paginate";
import { Paginator } from 'primereact/paginator';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';

import Editproduct from "./editproduct";
import Deleteproduct from "./deleteproduct";
import { fetchData, putData } from "../Api/apihandler";
import { config } from "../config";

import ProductStatusUpdate from '../ProductUpdates/ProductStatus';
import BulkProductDelete from "../ProductUpdates/ProductDelete";

const Myproductlist = () => {
    let [productlist, pickproductlist] = useState([]);
    let [filterkey, pickfilterkey] = useState("");
    let [viewproduct, pickviewproduct] = useState({});
    let [selectedProducts, pickSelectedProducts] = useState([]);

    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [itemsCount, setItemsCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const handlePagination = (event) =>{
        setFirst(event.first);
        setRows(event.rows);
        getproducts(event.first, event.rows);
    }

    const handleproductactive = async(productactive, id, name) => {
        let active = productactive === "InStock" ? "OutOfStock" : "InStock";
         let updatestock = { id: id, active: active };
        await putData(`${config.updatestock}/${id}`, updatestock)
        .then(res => {
            swal(res.message, name, "success")
                .then(() => {
                    setFirst(0);
                    getproducts();
                })
        })
    }

    const getproducts = async(skip=0, limit=10) => {
        setIsLoading(true);
        await fetchData(`${config.getsellerproduct}?sellerid=${localStorage.getItem("sellerid")}&skip=${skip}&limit=${limit} `)
        .then(res => {
            pickproductlist(res.product.reverse());
            setItemsCount(res.productsCount);
            setIsLoading(false);
        })
    }
    

    useEffect(() => {
            getproducts();
    }, []);


    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-sm-12 m-auto">
                    <div className="col-lg-6 col-md-8 col-sm-10 col-12 mb-3 ms-auto me-auto">
                        <div className="row">
                            <div className="col-md-8 col-12 mb-2">
                                <div className="input-group">
                                    <span className="input-group-text bg-warning"> 
                                        <i className="fa fa-search"></i>
                                    </span>
                                    <input 
                                        type="text" 
                                        className="form-control shadow-none" 
                                        placeholder="Search here..." 
                                        onChange={obj => pickfilterkey(obj.target.value)} 
                                        value={filterkey} 
                                    />
                                </div>
                            </div>
                            <div className="col-md-4 col-12 text-center">
                                <button onClick={() => pickfilterkey("")} className="btn btn-danger btn-sm"> Reset Filter</button>
                            </div>
                        </div>
                    </div>
                    <h3 className="mb-3"> Total products : <b className="text-primary">{itemsCount}</b> </h3>

                    <div className="card mb-2">
                        <div className="card-body p-0">
                            {
                                selectedProducts.length > 0 && (
                                    <Toolbar
                                        left={() => (
                                            <>
                                                <ProductStatusUpdate data = {selectedProducts} refresh={getproducts} />
                                                <BulkProductDelete data = {selectedProducts} refresh={getproducts} />
                                            </>
                                        )}
                                    />
                                )
                            }
                            <DataTable
                                value={productlist}
                                selection={selectedProducts} 
                                onSelectionChange={(e) => pickSelectedProducts(e.value)}
                                stripedLines
                            >
                                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                                <Column header="Product" body={(rowdata)=><img src={`${config.host}/productimages/${rowdata.productimage}`} width="60" height="60" className="sellerorder" data-bs-toggle="modal" data-bs-target="#myModal" alt="" />} />
                                <Column header="Name" style={{ width: '600px', textAlign: 'left' }}  body={(rowdata)=><p data-bs-toggle="modal" data-bs-target="#myModal" onClick={()=>{pickviewproduct(rowdata)}} > {rowdata.productname}</p>} />
                                <Column header="Price" sortable field="productprice" />
                                <Column header="Brand" body={(rowData) => <b>{rowData.brandname.toUpperCase()}</b>} />
                                <Column header="Status"  body={(rowdata)=> <div className="ps-3" style={{width:'120px'}}>
                                        <div className="form-check form-switch d-flex align-items-center">
                                            <input className="form-check-input" type="checkbox" id="mySwitch" name="productactive" value={rowdata.productactive} checked={rowdata.productactive === "InStock"} onChange={handleproductactive.bind(this, rowdata.productactive, rowdata._id, rowdata.productname)} />
                                            <span className="form-check-label ms-2 ps-2 pe-2 pt-1 pb-1 text-white" htmlFor="mySwitch" style={{ backgroundColor: rowdata.productactive === "OutOfStock" ? 'red' : 'green', borderRadius: '10px',  }}>
                                                <b> {rowdata.productactive} </b>
                                            </span>
                                        </div>
                                    </div>
                                } />
                                <Column header="Edit" body={(rowdata) => <Editproduct productdata={rowdata} refresh={getproducts} /> } />
                                <Column header="Delete" body={(rowdata) => <Deleteproduct id={rowdata._id} name={rowdata.productname} /> }/>

                            </DataTable>
                        </div>
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
