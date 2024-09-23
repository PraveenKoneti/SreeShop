
import { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap'; // Bootstrap Modal and Button
import 'primeicons/primeicons.css'; // Import PrimeIcons CSS
import Adminapp from './Adminapp/admin';
import Useraccount from './userlogin/useraccount';

import Sellerapp from './sellerdetails/sellerapp';
import Selleraccount from './sellerlogin/selleraccount';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function App() {
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem("acknowledgedTestMessage")) {
            setShowModal(true);
        }
    }, []);

    const handleCloseModal = () => {
        setShowModal(false);
        localStorage.setItem("acknowledgedTestMessage", "true");
    };

    let content;
    if (localStorage.getItem("SreeShoppermit") === "sellerlogin") {
        content = localStorage.getItem("sellerid") === null ? <Selleraccount /> : <Sellerapp />;
    } else {
        content = localStorage.getItem('userlogin') === false? <Useraccount/> : <Adminapp /> ;
    }

    return (
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
