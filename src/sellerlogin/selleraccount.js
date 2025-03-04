import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Sellerlogin from "./sellerlogin";
import Sellersignup from "./sellersignup";

const Selleraccount = () => {
    return (
        <>
            <Routes>
                {/* If sellerid is not present in localStorage, redirect to sellerlogin */}
                {localStorage.getItem("sellerid") === null && (
                    <Route path="/*" element={<Navigate to="/sellerlogin" replace />} />
                )}
                <Route path="/sellerlogin" element={<Sellerlogin />} />
                <Route path="/sellersignup" element={<Sellersignup />} />
            </Routes>
        </>
    );
}

export default Selleraccount;
