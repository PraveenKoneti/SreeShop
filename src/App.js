
import { HashRouter } from 'react-router-dom';

import Adminapp from './Adminapp/admin';
import Sellerapp from './sellerdetails/sellerapp';
import Selleraccount from './sellerlogin/selleraccount';

function App() {

        //localStorage.clear();
        if(localStorage.getItem("SreeShoppermit") === "sellerlogin")
        {
                if(localStorage.getItem("sellerid") === null)
                        return( <Selleraccount/>)
                else
                        return( <Sellerapp/> )
        }
        else
                return( <Adminapp/> )



        // localStorage.setItem("SreeShoppermit", "sellerlogin");
        // localStorage.setItem("sellerlogin", "false");

        // localStorage.setItem("userid", userinfo[0]._id);
        // localStorage.setItem("username", userinfo[0].firstname);

        // localStorage.setItem("userlogin", "false")  *** false is default
        // localStorage.setItem("userlogin", "true")   *** true is to get login and signup page

        // localStorage.setItem("sellerid", sellerinfo[0]._id);
        // localStorage.setItem("sellername", sellerinfo[0].firstname);
}

export default App;
