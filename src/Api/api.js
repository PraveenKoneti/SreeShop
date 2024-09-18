import axios from "axios";



export const login = async(url, data, headers) =>{
    let ret = {};
    await axios.post(url, data, {headers:headers} )
    .then(res=>{
        ret = res.data;
    })
    return ret;
}


export const register = async(url, data, headers) => {
    let ret = {};
    await axios.post(url, data, {headers:headers} )
    .then(res=>{
        ret = res.data;
    })
    return ret;
}


export const fetchData = async(url,  headers) => {

    let ret = {};
    await axios.get(url, {headers:headers} )
    .then(res=>{
        ret = res.data;
    })
    return ret;

}


export const postData = async(url, data, headers) =>{

    let ret = {};
    await axios.post(url, data, {headers:headers} )
    .then(res=>{
        ret = res.data;
    })
    return ret;

}



export const putData = async(url, data, headers) =>{

    let ret = {};
    await axios.put(url, data, {headers:headers} )
    .then(res=>{
        ret = res.data;
    })
    return ret;

}


export const deleteData = async(url, headers) =>{

    let ret = {};
    await axios.delete(url, {headers:headers} )
    .then(res=>{
        ret = res.data;
    })
    return ret;
    
}