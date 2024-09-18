
import { useState, useEffect } from "react";
import swal from "sweetalert";
import { Navigate } from "react-router-dom";
import moment from "moment";
import { fetchData, postData } from "../Api/apihandler";
import { config } from "../config";


const Mynewproduct = () =>
{

        let[brandname, pickbrandname] = useState("");
        let[categoryname, pickcategoryname] = useState("");
        let[pname, pickpname] = useState("");
        let[pprice, pickpprice] = useState("");
        let[pactive, pickpactive] = useState("");
        let[pphoto, pickpphoto] = useState(null);
        let[pdescription, pickpdescription] = useState("");

        let[brandnameerror, pickbrandnameerror] = useState("");
        let[categorynameerror, pickcategorynameerror] = useState("");
        let[nameerror, picknameerror] = useState("");
        let[priceerror, pickpriceerror] = useState("");
        let[pactiveerror, pickpactiveerror] = useState("");
        let[photoerror, pickphotoerror] = useState("");
        let[deserror, pickdeserror] = useState("");

        let[generatedURL, setGeneratedURL] = useState("");
        let[urlerror, pickurlerror] = useState("");


        const saveproduct = async(e) => 
        {
            if(brandname !== "" && categoryname !== "" && pname !== "" && pprice !== "" && pactive !== "" && pphoto !== null && pdescription !== " ")
            {
                e.preventDefault(); // Prevent default form submission behavior


                const date = moment().format('MMMM Do YYYY, h:mm:ss a');
            

                // Create a new FormData instance and append form data
                const formData = new FormData();
                formData.append('sellerid', localStorage.getItem('sellerid'));
                formData.append('brandname', brandname);
                formData.append('categoryname', categoryname);
                formData.append('productname', pname);
                formData.append('productprice', pprice);
                formData.append('productactive', pactive);
                formData.append('date', date);
                formData.append('productimage', pphoto); // Append the actual file object
                formData.append('producturl', generatedURL);
                formData.append('productdescription', pdescription);
            
                // Make POST request using axios
                await postData(config.saveproduct, formData)
                .then(res => {
                    swal("Record Saved Successfully", "", "success");
                    // Reset form fields
                    pickbrandname('');
                    pickcategoryname('');
                    pickpname('');
                    pickpprice('');
                    pickpactive('');
                    pickpphoto(null); // Reset file state
                    pickpdescription('');
                    setGeneratedURL("");
                })
                .catch(err => {
                    console.error("Error saving record:", err);
                    swal("Error saving record", err.message, "error");
                });
            }
            else
            {
                if(brandname == "")
                    pickbrandnameerror("wrong");
                if(categoryname == "")
                    pickcategorynameerror("wrong");
                if(pname == "")
                    picknameerror("wrong");
                if(pprice == "")
                    pickpriceerror("wrong");
                if(pactive == "")
                    pickpactiveerror("wrong");
                if(pphoto == null)
                    pickphotoerror("wrong");
                if(pdescription == "")
                    pickdeserror("wrong");
                if(generatedURL == "");
                    pickurlerror("wrong");
            }
        };
        
        const handleFileChange = (e) => {
            // Update state with the selected file object
            const file = e.target.files[0];
            pickpphoto(file);
        };


        
        const generateURLFromName = (name) => {
            // Convert to lowercase and replace spaces with dashes
            let slug = name.toLowerCase().replace(/\s+/g, '-');
            // Remove special characters except dashes
            slug = slug.replace(/[^a-z0-9-]+/g, '');
            return slug;
        };
    
        // Handle product name change
        const handleProductNameChange = (e) => {
            // Check if e and e.target are defined
            if (e && e.target && e.target.value !== undefined) {
                const value = e.target.value;
                pickpname(value);
                // Generate URL-friendly slug and update the state
                const urlSlug = generateURLFromName(value);
                setGeneratedURL(urlSlug);
            }
        };



        const formatPrice = (value) => {
            // Convert value to number and ensure it's not NaN
            const hasHyphen = value.includes('-');
            const alphabetPattern = /[a-zA-Z\s]/;
            let alpha =  alphabetPattern.test(value);
            if (hasHyphen || alpha) 
                return value; 
            
            // Remove non-digit characters
            let numericValue = value.replace(/[^0-9]/g, '');
        
            if (numericValue.length === 0) return '';
        
            // Convert to number
            let numberValue = parseFloat(numericValue);
        
            // Format as currency without currency symbol
            const parts = new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).formatToParts(numberValue);
        
            // Exclude the currency symbol part
            const formattedValue = parts.reduce((acc, part) => {
                if (part.type !== 'currency') {
                    return acc + part.value;
                }
                return acc;
            }, '');
        
            return formattedValue;
        };


        let[brandlist, pickbrandlist] = useState( [] );
        const getbrands = async() =>
        {
            await fetchData(config.getbrands)
            .then(brandArray=>{
                pickbrandlist( brandArray );
            })
        }

        let[categorylist, pickcategorylist] = useState( [] );
        const getcategories = async() =>
        {
            await fetchData(config.getcategories)
            .then(categoryArray=>{
                pickcategorylist( categoryArray );
            })
        }

        useEffect(()=>{getbrands(); getcategories();}, []);


        
        return(
            <div className="container">
                <form onSubmit={saveproduct} encType='multipart/form-data'>
                    <div className="row mt-2">
                        <h1 className="text-primary text-center mb-5"> Enter Product Details </h1>
                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-4">
                            <div className="row">
                                <div className="col-4"> <h6> Brand Name   </h6> </div>
                                <div className="col-8"> 
                                    <select type="text" className="selectpicker form-select" onChange={obj=>pickbrandname(obj.target.value)} value={brandname} 
                                        style={{border: (brandname=="")?(brandnameerror=="wrong")?'4px solid red':'':'', boxShadow: (brandname=="")?(brandnameerror=="wrong")?'0px 0px 5px red':'':''}}
                                    >
                                        <option> Choose Brand </option>
                                        {
                                            brandlist.map((brands, index)=>{
                                                return(
                                                    <option key={index}> {brands.brandname} </option>
                                                )
                                            })
                                        }

                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-4">
                            <div className="row">
                                <div className="col-4"> <h6>  Category Name   </h6> </div>
                                <div className="col-8"> 
                                    <select type="number" className="form-select" onChange={obj=>{pickcategoryname(obj.target.value)}} value={categoryname}
                                        style={{border: (categoryname=="")?(categorynameerror=="wrong")?'4px solid red':'':(categorynameerror=="wrong")?'4px solid red':'', boxShadow: (categoryname=="")?(categorynameerror=="wrong")?'0px 0px 5px red':'':''}}
                                    >
                                        <option> Choose Category </option>
                                        {
                                            categorylist.map((category, index)=>{
                                                return(
                                                    <option key={index}> {category.categoryname} </option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-4">
                            <div className="row">
                                <div className="col-4"> <h6> Product Name  </h6> </div>
                                <div className="col-8"> 
                                    <input type="text" className="form-control" onChange={(e) => {pickpname(e.target.value); handleProductNameChange(e);}}  value={pname}
                                        style={{border: (pname==="")?(nameerror==="wrong")?'4px solid red':'':'', boxShadow: (pname=="")?(nameerror=="wrong")?'0px 0px 5px red':'':''}}
                                    />
                                </div>
                            </div>
                        </div>


                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5">
                            <div className="row">
                                <div className="col-4"> <h6> Product Price  </h6> </div>
                                <div className="col-8"> 
                                    <input type="text" className="form-control" onChange={obj => pickpprice(formatPrice(obj.target.value))} value={pprice}
                                        style={{ border: (pprice === "") ? (priceerror === "wrong") ? '4px solid red' : '' : '', boxShadow: (pprice === "") ? (priceerror === "wrong") ? '0px 0px 5px red' : '' : '' }}
                                    />
                                </div>
                            </div>
                        </div>


                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5">
                            <div className="row">
                                <div className="col-4"> <h6> Product Image  </h6> </div>
                                <div className="col-8 text-center"> 
                                    <input type="file" accept=".png, .jpg, .jpeg" className="form-control"  onChange={handleFileChange} 
                                        style={{border: (pphoto=="")?(photoerror=="wrong")?'4px solid red':'':(photoerror == "wrong")?'4px solid red':'', boxShadow: (pphoto=="")?(photoerror=="wrong")?'0px 0px 5px red':'':(photoerror == "wrong")?'0px 0px 5px red':''}} 
                                    /> 
                                </div>
                            </div>
                        </div>


                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-5">
                            <div className="row">
                                <div className="col-4"> <h6> Product Active  </h6> </div>
                                <div className="col-8"> 
                                        <select className="form-select" onChange={obj=>pickpactive(obj.target.value)} value={pactive}
                                            style={{border: (pactive=="")?(pactiveerror=="wrong")?'4px solid red':'':'', boxShadow: (pactive=="")?(pactiveerror=="wrong")?'0px 0px 5px red':'':''}}
                                        >
                                            <option value=""> Choose </option>
                                            <option> In Stock </option>
                                            <option> Not in Stock </option>
                                        </select>
                                </div>
                            </div>
                        </div>


                        <div className="mb-5">
                            <div className="row">
                                <div className="col-3"> <h6> Product URL  </h6> </div>
                                <div className="col-9"> 
                                    <input type="text" className="form-control" value={generatedURL}
                                        style={{border: (generatedURL==="")?(urlerror==="wrong")?'4px solid red':'':'', boxShadow: (generatedURL=="")?(urlerror=="wrong")?'0px 0px 5px red':'':''}} 
                                    /> 
                                </div>
                            </div>
                        </div>

                        <div className="mb-5">
                            <div className="row">
                                <div className="col-3"> <h6> Product Description  </h6> </div>
                                <div className="col-9"> 
                                    <textarea type="text" className="form-control" rows="3"  onChange={obj=>pickpdescription(obj.target.value)} value={pdescription}
                                        style={{border: (pdescription === "")?(deserror==="wrong")?'4px solid red':'':'', boxShadow: (pdescription=="")?(deserror=="wrong")?'0px 0px 5px red':'':''}} 
                                    > 
                                    </textarea>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 text-center"> <button className="btn btn-primary fs-4"> Save Product Details </button></div>
                    </div>
                </form>
            </div>
        )
}

export default Mynewproduct;