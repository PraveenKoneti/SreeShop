

//let host = 'http://localhost:7777';
let host = "https://sreeshopbackend.onrender.com"

export const config = {

        host : `${host}`,

        //ADMIN.JS
        productsearch: `${host}/product/search`,

        // LOGIN.JS
        userlogin: `${host}/user/userlogin`,

        //  SIGNUP.JS
        userregister:   `${host}/user/saveuser`,
        checkuser:      `${host}/user/checkuser`,
        sendemail:      `${host}/email/sendemail`,

        // DISPLAYTYPE.JS
        savewishlist :              `${host}/wishlist/savewishlist`,
        deletewishlist:             `${host}/wishlist/deletewishlist`,
        savecartlist :              `${host}/cartlist/savecartlist`,
        getparticularbrandproduct:  `${host}/product/getparticularbrandproduct`,
        getproducts:                `${host}/product/getproducts`,

        //DISPLAYSINGLE.JS
        getwishlist:    ` ${host}/wishlist/getwishlist`,
        getoneproduct: `  ${host}/product/getoneproduct`,

        //CARTLIST.JS
        deletecartlist:  `${host}/cartlist/deletecartlist`,
        updatecartlist:  `${host}/cartlist/updatecartlist`,
        saveorder:       `${host}/orderlist/saveorder`,
        sendemailpdf:    `${host}/emailpdf/sendemailpdf`,
        getcartlist:     `${host}/cartlist/getcartlist`,

        //MYORDERS.JS
        getorderlist:    `${host}/orderlist/getorderlist`,
        cancelorder:     `${host}/orderlist/cancelorder`,

        //MYPROFILE.JS
        updateuser:      `${host}/user/updateuser`,
        userdetails:     `${host}/user/userdetails`,

        //SELLERLOGIN.JS
        sellerlogin:     `${host}/seller/sellerlogin`,

        //SELLERSIGNUP.JS
        checkseller:     `${host}/seller/checkseller`,
        saveseller:      `${host}/seller/saveseller`,

        //BRANDCATEGORY.JS
        savebrand:        `${host}/brand/savebrand`,
        savecategory:     `${host}/category/savecategory`,

        //DASHBOARD.JS
        getsellerproduct:  `${host}/product/getsellerproduct`,
        getsellerorders:   `${host}/orderlist/getsellerorders`,

        //DELETEPRODUCT.JS
        deleteproduct:     `${host}/product/deleteproduct`,

        //EDITPRODUCT.JS
        updateproduct:     `${host}/product/updateproduct`,

        //NEWPRODUCT.JS 
        getcategories:     `${host}/category/getcategories`,
        getbrands:         `${host}/brand/getbrands`,
        saveproduct:       `${host}/product/saveproduct`,

        //ORDERLIST.JS
        getsellerorders:   `${host}/orderlist/getsellerorders`,

        //PRODUCTLIST.JS
        updatestock:       `${host}/product/updatestock`,

        //PRODUCTINSTOCK.JS
        instockcount:       `${host}/product/instockcount`,
        outofstockcount:    `${host}/product/outofstockcount`,

        //PRODUCTCATEGORYPIECHART.JS 
        getpiechartdata:    `${host}/product/getpiechartdata`,

        //ORDERBARCHART.JS
        getorderedcancelledproductsdata :  `${host}/product/getorderedcancelledproductsdata`,

        //PRODUCTORDEREDCHART.JS
        getorderproducts:  `${host}/product/getorderproducts`,

        //PRODUCTCANCELLEDCHART.JS
        getcancelledproducts:  `${host}/product/getcancelledproducts`,

};
