import React, { useState, useRef } from "react";
import { Button } from "primereact/button"; // You can still use PrimeReact Button for consistency
import { putData } from "../Api/apihandler";
import { config } from "../config";
import swal from "sweetalert";
import { Toast } from 'primereact/toast'; // Import Toast component
const ProductStatusUpdate = (props) => {
    const [showModal, setShowModal] = useState(false); // State for modal visibility
    const [selectedStatus, setSelectedStatus] = useState("InStock"); // State for selected status


    const toastRef = useRef(null); // Create a ref for the toast

    const showToast = (severity, detail, isLoading = false, summary) => {
        const content = (
            <div className="d-flex align-items-center">
                <span>{detail}</span>
                {isLoading && (
                    <div className="loader-dots ms-2" > {/* Remove margin */}
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                )}
            </div>
        );
        toastRef.current.show({ severity, summary: summary, detail: content });
    };


    const productStatusUpdate = async () => {

        showToast('info', 'Updating Product Status', true); // Show loading toast

        let productids = props.data.map((ele) => ele._id);
        // Update the product status based on selectedStatus
        await putData(`${config.bulkproductstatusupdate}`, { status: selectedStatus, id:productids })
        .then(res=>{
            toastRef.current.clear();
            showToast("success","Prosucts Status Updated Successfully")
            setTimeout(() => {
                toastRef.current.clear();
                props.refresh()
            }, 1500);
        })
        // Close the modal after updating
        setShowModal(false);
    };

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div>
            <Toast ref={toastRef} position="center" className="custom-toast" />{/* Include the Toast component */} 
            <Button
                className="btn btn-outline-danger btn-sm"
                icon="pi pi-refresh"
                label="Product Status Update"
                onClick={openModal}
            />

            {/* Bootstrap Modal */}
            <div className={`modal fade ${showModal ? "show" : ""}`} style={{ display: showModal ? "block" : "none" }} tabIndex="-1" role="dialog" aria-labelledby="modalTitle" aria-hidden={!showModal}>
                <div className="modal-dialog modal-dialog-centered" role="document"> {/* Added modal-dialog-centered class */}
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="modalTitle">Update Product Status</h5>
                            <button type="button" className="close ms-auto btn btn-outline-dark" onClick={closeModal} aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <h5>Select Product Status:</h5>
                            <div className="form-group">
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        value="InStock"
                                        checked={selectedStatus === "InStock"}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        id="inStock"
                                    />
                                    <label className="form-check-label" htmlFor="inStock">
                                        In Stock
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        value="OutOfStock"
                                        checked={selectedStatus === "OutOfStock"}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        id="outOfStock"
                                    />
                                    <label className="form-check-label" htmlFor="outOfStock">
                                        Out of Stock
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <Button label="Cancel" onClick={closeModal} className="me-3 btn btn-sm btn-outline-dark" />
                            <Button label="Update Status" onClick={productStatusUpdate} className="btn btn-sm btn-outline-success" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Backdrop */}
            {showModal && <div className="modal-backdrop fade show" onClick={closeModal} />}
        </div>
    );
};

export default ProductStatusUpdate;
