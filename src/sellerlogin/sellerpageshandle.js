import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Handlesellerpage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem("SreeShoppermit", "sellerlogin");

        return () => {
            // Cleanup localStorage when leaving seller flow
            localStorage.removeItem("SreeShoppermit");
        };
    }, []);

    // Redirect to home page if not in seller flow
    if (!localStorage.getItem("sellerid")) {
        navigate("/SreeShop/home", { replace: true });
    }

    return null;
};

export default Handlesellerpage;
