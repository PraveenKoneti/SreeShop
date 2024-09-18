import { HashRouter, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";


import Sellerlogin from "./sellerlogin";
import Sellersignup from "./sellersignup";



const Selleraccount = () =>
{
        return(
            <HashRouter>
                <Routes>
                    {localStorage.getItem("sellerid") === null && <Route path="/*" element={<Navigate to="/sellerlogin" replace />} />}
                    <Route path="/sellerlogin" element={ <Sellerlogin/>} />
                    <Route path="/sellersignup" element={ <Sellersignup/>} />
                </Routes>
            </HashRouter>
        )
}

export default Selleraccount;