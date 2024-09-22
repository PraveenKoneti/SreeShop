import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Handlesellerpage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem("SreeShoppermit", "sellerlogin");
        window.location.reload();
        return () => {
            // Cleanup localStorage when leaving seller flow
            localStorage.removeItem("SreeShoppermit");
        };
    }, []);

    // Redirect to home page if not in seller flow
    if (!localStorage.getItem("sellerid")) {
        navigate("/home", { replace: true });
    }

    return null;
};

export default Handlesellerpage;
