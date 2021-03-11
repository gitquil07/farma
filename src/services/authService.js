import axiosInstance from "./api";

const api = '/user';


export const authApi = {
    register : data=> {
        return axiosInstance.post(`${api}/register`,data)
    },
    login : data=> {
        return axiosInstance.post(`${api}/login`,data)
    },
    userMe : token => {
        return axiosInstance.get(`${api}/me`)
    },
    changePassword : (data,id) => {
        return axiosInstance.put(`${api}/change-password/${id}`,data)
    }
};


// export const authApi = {
//     register : data=> {
//         return axiosInstance.post(`${api}/register`,data)
//     },
//     login : data=> {
//         return axiosInstance.post(`${api}/login`,data)
//     },
//     userMe : token => {
//         return axiosInstance.get(`${api}/me`,{
//             headers : {
//                 token : token,
//             }
//         })
//     }
// }
