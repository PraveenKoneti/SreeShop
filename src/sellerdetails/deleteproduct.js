
import swal from "sweetalert";
import { deleteData } from "../Api/apihandler";
import { config } from "../config";

const Deleteproduct = (props) =>{

    const deleteproduct = async(id) =>{
        await deleteData(`${config.deleteproduct}/${id}`)
        .then(res=>{
            swal(res.message,props.name,"success")
            .then(res=>{
                window.location.reload();
            })
        })
    }

    return(
        <div className="container">
            <div className="row">
                <div>
                    <button onClick={deleteproduct.bind(this, props.id)} className="btn btn-danger btn-sm form-control"> Delete </button>
                </div>
            </div>
        </div>
    )

}

export default Deleteproduct;