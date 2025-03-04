
import swal from "sweetalert";
import { deleteData } from "../Api/apihandler";
import { config } from "../config";

import { Button } from 'primereact/button';

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
                <Button icon="pi pi-trash" rounded outlined className="mr-2 text-danger rounded-pill" severity="danger" onClick={deleteproduct.bind(this, props.id)} />
                    {/* <button onClick={deleteproduct.bind(this, props.id)} className="btn btn-danger btn-sm"> <i className="fa fa-trash"></i> Delete </button> */}
                </div>
            </div>
        </div>
    )

}

export default Deleteproduct;