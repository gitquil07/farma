import axios from "axios";
import {Redirect} from "react-router-dom";
import history from "../history";

let axiosInstance = axios.create({
    baseURL : "http://api.duqum.uz",
});


// Interceptor for request used to add token to each requests
// header
axiosInstance.interceptors.request.use(
    request => {
        request.headers.token = sessionStorage.getItem("token");
        return request;
    },
    error => {
        return error;
    }
);


// Interceptor for response used to check response returned with status code equal to 401 or 402
// remove token from storage and redirect to login page
axiosInstance.interceptors.response.use(
    response => {
        return response;
    },
    error => {

        try{
            if(error.response.status === 401 || error.response.status === 402){
                console.log(error.response.status);
                sessionStorage.removeItem("token");
                window.location.replace("/login");
            }
        }catch(err){
            return Promise.reject(error);
        }
     
        return Promise.reject(error);
    },
);


export default axiosInstance;

