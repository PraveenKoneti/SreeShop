import React, { useState, useRef } from "react";
import { Button } from "primereact/button";
import { Modal } from "react-bootstrap";
import { deleteData } from "../Api/apihandler";
import { config } from "../config";
import { Toast } from 'primereact/toast'; // Import Toast component

const BulkProductDelete = (props) => {
    const [show, setShow] = useState(false); // State for modal visibility

    const handleShow = () => setShow(true); // Show modal
    const handleClose = () => setShow(false); // Close modal

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

    const handleDelete = async() => {

        showToast('info', 'Deleting product', true); // Show loading toast

        // Add logic for deletion, such as making an API call to delete the products
        let productIds = props.data.map(product => product._id);
        
        await deleteData(`${config.bulkproductsdelete}/${productIds}`)
        .then(res=>{
            toastRef.current.clear();
            showToast("success",res.message)
            setTimeout(() => {
                props.refresh();
            }, 1500);
        })
        // After deletion, close the modal
        setShow(false);
    };

    return (
        <div>
           <Toast ref={toastRef} position="center" className="custom-toast" />{/* Include the Toast component */} 
            <Button
                className="btn btn-outline-danger btn-sm ms-3"
                icon="pi pi-trash"
                label="Product Delete"
                onClick={handleShow}
            />

            {/* Modal */}
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Product Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Are you sure you want to delete these products? Once deleted, the data
                        will not be recoverable.
                    </p>
                    <ul>
                        {props.data.map((product) => (
                            <li key={product._id}>{product.productname}</li>
                        ))}
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        label="Cancel"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={handleClose}
                    />
                    <Button
                        label="Delete"
                        className="btn btn-outline-danger btn-sm"
                        onClick={handleDelete}
                    />
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default BulkProductDelete;
