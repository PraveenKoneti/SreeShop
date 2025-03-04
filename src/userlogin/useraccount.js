import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Userlogin from './login';
import UserSignup from './signup';
import { useEffect } from 'react';

const Useraccount = () => {
    useEffect(() => {
    }, []); // Add an empty dependency array to run only once

    return (
        <>
            <Routes>
                {JSON.parse(localStorage.getItem('userloginpermission')) === true && <Route path="*" element={<Navigate to="/userlogin" replace />} /> }
                {JSON.parse(localStorage.getItem('usersignuppermission')) === true && <Route path="*" element={<Navigate to="/usersignup" replace />} />}
                
                <Route path="/userlogin" element={<Userlogin />} />
                <Route path="/usersignup" element={<UserSignup />} />
                {/* Redirect base path to /userlogin */}
                <Route path="*" element={<Navigate to="/userlogin" replace />} />
            </Routes>
        </>
    );
};

export default Useraccount;
