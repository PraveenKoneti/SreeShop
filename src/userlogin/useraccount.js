import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Userlogin from './login';
import UserSignup from './signup';

const Useraccount = () => {
    
    return (
        <HashRouter>

            <Routes>
                {localStorage.getItem("userlogin") == "true" && <Route path="/*" element={<Navigate to="/userlogin" replace />} />}
                <Route path="/userlogin" element={<Userlogin />} />
                <Route path="/usersignup" element={<UserSignup />} />
            </Routes>
        </HashRouter>
       
    );
};

export default Useraccount;
