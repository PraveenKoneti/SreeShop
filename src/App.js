
import { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap'; // Bootstrap Modal and Button
import 'primeicons/primeicons.css'; // Import PrimeIcons CSS
import Adminapp from './Adminapp/admin';
import Useraccount from './userlogin/useraccount';

import { BrowserRouter } from 'react-router-dom';

import Sellerapp from './sellerdetails/sellerapp';
import Selleraccount from './sellerlogin/selleraccount';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function App() {
    const [showModal, setShowModal] = useState(false);

    //localStorage.clear();

    useEffect(() => {
        if (!localStorage.getItem("acknowledgedTestMessage")) {
            setShowModal(true);
        }// Prevent right-click context menu
        const handleContextMenu = (e) => {
            e.preventDefault();
        };


        // Prevent key combinations for opening DevTools
        // const handleKeyDown = (e) => {
        //     if (
        //         (e.ctrlKey && e.key === 'u') || (e.ctrlKey && e.key === 'U') ||  // Ctrl+U
        //         (e.ctrlKey && e.key === 'i') || (e.ctrlKey && e.key === 'i') ||  // Ctrl+I
        //         (e.ctrlKey && e.key === 'c') || (e.ctrlKey && e.key === 'c') ||  // Ctrl+C
        //         (e.ctrlKey && e.key === 'j') || (e.ctrlKey && e.key === 'j') ||  // Ctrl+J
        //         e.key === 'F12' ||               // F12
        //         (e.ctrlKey && e.shiftKey && e.key === 'I') ||  // Ctrl+Shift+I
        //         (e.ctrlKey && e.shiftKey && e.key === 'J') ||  // Ctrl+Shift+J
        //         (e.ctrlKey && e.shiftKey && e.key === 'C') ||  // Ctrl+Shift+C
        //         (e.ctrlKey && e.shiftKey && e.key === 'U')     // Ctrl+Shift+U 
        //     ) {
        //         e.preventDefault();
        //     }
        // };

        // // Add event listeners
        // document.addEventListener('contextmenu', handleContextMenu);
        // document.addEventListener('keydown', handleKeyDown);

        // // Clean up event listeners on unmount
        // return () => {
        //     document.removeEventListener('contextmenu', handleContextMenu);
        //     document.removeEventListener('keydown', handleKeyDown);
        // };
    }, []);




    const handleCloseModal = () => {
        setShowModal(false);
        localStorage.setItem("acknowledgedTestMessage", "true");
    };

    let content;
    if (localStorage.getItem("SreeShoppermit") === "sellerlogin") {
        content = localStorage.getItem("sellerid") === null ? <Selleraccount /> : <Sellerapp />;
    } 
    else {
        content = JSON.parse(localStorage.getItem('userloginpermission')) === true || JSON.parse(localStorage.getItem('usersignuppermission')) === true   ? <Useraccount/> : <Adminapp /> ;
    }

    return (
        <BrowserRouter>
            <div>
                {/* Bootstrap Modal */}
                <Modal show={showModal} onHide={()=>{setShowModal(false);}} centered size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <i className="pi pi-exclamation-triangle text-warning me-2" />
                            Important Notice
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="text-center">
                            <i className="pi pi-exclamation-triangle text-warning mb-3" style={{ fontSize: '60px' }} />
                            <p className='text-start'>
                                <b> <span className='text-danger'> * </span> This website is for testing purposes only and not intended for real-time use. </b>
                                <br />
                                <b> <span className='text-danger'> * </span>  The content displayed here is simulated for development and demonstration.</b>
                                <br />
                            <b> <span className='text-danger'> * </span> All data entered here is temporary and may be erased without notice. </b>
                            </p>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleCloseModal}>
                            OK
                        </Button>
                    </Modal.Footer>
                </Modal>
                


                {content}



            </div>
        </BrowserRouter>
    );
}

export default App;





        // localStorage.setItem("SreeShoppermit", "sellerlogin");
        // localStorage.setItem("sellerlogin", "false");

        // localStorage.setItem("userid", userinfo[0]._id);
        // localStorage.setItem("username", userinfo[0].firstname);

        // localStorage.setItem("userlogin", "false")  *** false is default
        // localStorage.setItem("userlogin", "true")   *** true is to get login and signup page

        // localStorage.setItem("sellerid", sellerinfo[0]._id);
        // localStorage.setItem("sellername", sellerinfo[0].firstname);
