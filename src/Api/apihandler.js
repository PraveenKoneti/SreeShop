import * as api from './api';

const headers = { 
    'Content-Type': 'application/json', 
    'Authorization': `Bearer ${localStorage.getItem('usertoken')}` 
};

// Call `api.login` using the imported `api` object
export const login = (url, data) => {
    return api.login(url, data, headers);
};


export const register = (url, data) =>{
    return api.register(url, data, headers);
}



export const fetchData = (url) =>{
    return api.fetchData(url, headers);
}



export const postData = (url, data) =>{
    return api.postData(url, data, headers)
}



export const putData = (url, data) =>{
    return api.putData(url, data, headers)
}


export const deleteData = (url) =>{
    return api.deleteData(url, headers)
}