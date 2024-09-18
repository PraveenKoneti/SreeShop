import { useState } from "react";
import swal from "sweetalert";
import { putData } from "../Api/apihandler";
import { config } from "../config";

const Editproduct = ({ productdata, updateProductList }) => {
    const [brandname, pickbrandname] = useState(productdata.brandname);
    const [categoryname, pickcategoryname] = useState(productdata.categoryname);
    const [pname, pickpname] = useState(productdata.productname);
    const [pprice, pickpprice] = useState(productdata.productprice);
    const [pactive, pickpactive] = useState(productdata.productactive);
    const [pdate, pickpdate] = useState(productdata.productdate)
    const [pphoto, pickpphoto] = useState(productdata.productimage);
    const [pdescription, pickpdescription] = useState(productdata.productdescription);
    const [generatedURL, setGeneratedURL] = useState(productdata.producturl);
    const [imagePreview, setImagePreview] = useState(`http://127.0.0.1:5500/backend%20mongodb/productimages/${productdata.productimage}`);
    const [imagePath, setImagePath] = useState(productdata.productimage);

    const [brandnameerror, pickbrandnameerror] = useState("");
    const [categorynameerror, pickcategorynameerror] = useState("");
    const [nameerror, picknameerror] = useState("");
    const [priceerror, pickpriceerror] = useState("");
    const [pactiveerror, pickpactiveerror] = useState("");
    const [photoerror, pickphotoerror] = useState("");
    const [deserror, pickdeserror] = useState("");
    const [urlerror, pickurlerror] = useState("");

    const generateURLFromName = (name) => {
        let slug = name.toLowerCase().replace(/\s+/g, '-');
        slug = slug.replace(/[^a-z0-9-]+/g, '');
        return slug;
    };

    const handleProductNameChange = (e) => {
        if (e && e.target && e.target.value !== undefined) {
            const value = e.target.value;
            pickpname(value);
            const urlSlug = generateURLFromName(value);
            setGeneratedURL(urlSlug);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) 
            pickpphoto(file.name);
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        const updatedProduct = {
            _id: productdata._id,
            brandname,
            categoryname,
            productname: pname,
            productprice: pprice,
            productactive: pactive,
            productdate: pdate,
            productimage: pphoto,
            productdescription: pdescription,
            producturl: generatedURL
        };
        await putData(`${config.updateproduct}/${productdata._id}`, updatedProduct)
        .then(res => {
            if (res.success) {
                updateProductList(updatedProduct);
                swal("Product updated successfully", pname, "success");
            } else {
                swal("Failed to update product", pname, "error");
            }
        });
    };

    return (
        <div>
            <button className="btn btn-success btn-sm form-control" data-bs-toggle="modal" data-bs-target={`#editModal${productdata._id}`}>Edit</button>

            <div className="modal fade" id={`editModal${productdata._id}`} tabIndex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 className="modal-title text-center text-primary m-auto">Edit Product Details</h2>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row mb-4">
                                    <div className="col-3 m-auto">
                                        <img src={`${config.host}/productimages/${productdata.productimage}`} width={100} height={100} alt="Product" />
                                    </div>
                                </div>
                            
                                <div className="row mb-3">
                                    <div className="col-4"> <h6>Product Name</h6> </div>
                                    <div className="col-8">
                                        <input type="text" className="form-control" onChange={handleProductNameChange} value={pname}
                                            style={{ border: pname === "" && nameerror === "wrong" ? '4px solid red' : '', boxShadow: pname === "" && nameerror === "wrong" ? '0px 0px 5px red' : '' }}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-4"> <h6>Product Price</h6> </div>
                                    <div className="col-8">
                                        <input type="number" className="form-control" onChange={obj => pickpprice(obj.target.value)} value={pprice}
                                            style={{ border: pprice === "" && priceerror === "wrong" ? '4px solid red' : '', boxShadow: pprice === "" && priceerror === "wrong" ? '0px 0px 5px red' : '' }}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-4"> <h6>Brand Name</h6> </div>
                                    <div className="col-8">
                                        <input type="text" className="form-control" onChange={obj => pickbrandname(obj.target.value)} value={brandname}
                                            style={{ border: brandname === "" && brandnameerror === "wrong" ? '4px solid red' : '', boxShadow: brandname === "" && brandnameerror === "wrong" ? '0px 0px 5px red' : '' }}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-4"> <h6>Category Name</h6> </div>
                                    <div className="col-8">
                                        <input type="text" className="form-control" onChange={obj => pickcategoryname(obj.target.value)} value={categoryname}
                                            style={{ border: categoryname === "" && categorynameerror === "wrong" ? '4px solid red' : '', boxShadow: categoryname === "" && categorynameerror === "wrong" ? '0px 0px 5px red' : '' }}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-4"> <h6>Product Active</h6> </div>
                                    <div className="col-8">
                                        <select className="form-select" onChange={obj => pickpactive(obj.target.value)} value={pactive}
                                            style={{ border: pactive === "" && pactiveerror === "wrong" ? '4px solid red' : '', boxShadow: pactive === "" && pactiveerror === "wrong" ? '0px 0px 5px red' : '' }}
                                        >
                                            <option value="">Choose</option>
                                            <option>In Stock</option>
                                            <option>Not in Stock</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-4"> <h6>Product Description</h6> </div>
                                    <div className="col-8">
                                        <textarea className="form-control" rows="3" onChange={obj => pickpdescription(obj.target.value)} value={pdescription}
                                            style={{ border: pdescription === "" && deserror === "wrong" ? '4px solid red' : '', boxShadow: pdescription === "" && deserror === "wrong" ? '0px 0px 5px red' : '' }}
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-4"> <h6>Product URL</h6> </div>
                                    <div className="col-8">
                                        <input type="text" className="form-control" value={generatedURL}
                                            style={{ border: generatedURL === "" && urlerror === "wrong" ? '4px solid red' : '', boxShadow: generatedURL === "" && urlerror === "wrong" ? '0px 0px 5px red' : '' }}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-4"> <h6>Product Image</h6> </div>
                                    <div className="col-8">
                                        <input type="file" className="form-control" onChange={handleImageChange} />
                                        <small className="text-muted">Current Image: {imagePath}</small>
                                    </div>
                                </div>
                                <div className="modal-footer text-center">
                                    <div className="m-auto">
                                        <button type="submit" className="btn btn-success me-4 ps-4 pe-4">Update</button>
                                        <button type="button" className="btn btn-danger ps-4 pe-4" data-bs-dismiss="modal">Close</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Editproduct;
