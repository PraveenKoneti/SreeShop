
import swal from "sweetalert";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import { postData } from "../Api/apihandler";
import { config } from "../config";

const Mybrandcategory = () =>
{


    let[bname, pickbname] = useState("");
    let[cname, pickcname] = useState("");

    const save = async() =>
    {
        if(bname !== "" && cname !== "")
        {
            let newbrand = {brandname:bname.toLowerCase()};
            await postData(config.savebrand, newbrand)
            .then(msg=>{

                categorysave();
            })
        }
        else
            swal("Please Enter the Details","Brand name, Category name", "warning");
    }

    const categorysave = async() =>
    {
        let newcategory = {categoryname:cname.toLowerCase()};
        await postData(config.savecategory, newcategory)
        .then(msg=>{
            swal(msg.message, "", "success");

            pickbname("");
            pickcname("");
        })
    }



    return(
        <div className="container">
            <div className="row mt-4">
                <div className="col-sm-4 col-md-4 col-lg-4 col-xl-4 col-xxl-4 m-auto">
                    <div className="card">
                        <div className="card-header bg-primary text-white text-center"> <h3>  Brand & Category Details </h3></div>
                        <div className="card-body"> 
                            <div className="row p-0 m-0 mb-3">
                                <h5> Enter New Brand Name </h5>
                                <input type="text" className="form-control mt-2" onChange={obj=>pickbname(obj.target.value)} value={bname} /> 
                            </div>

                            <div className="row p-0 m-0 mb-3">
                                <h5> Enter New Category Name </h5>
                                <input type="text" className="form-control mt-2" onChange={obj=>pickcname(obj.target.value)} value={cname} /> 
                            </div>

                            <div className="col-4 m-auto mt-4"> 
                                <button onClick={save} className="btn btn-primary form-control"> Save </button>
                            </div>
                
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Mybrandcategory;