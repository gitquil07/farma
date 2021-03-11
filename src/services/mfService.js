import axiosInstance from "./api";

const api = '/mf';

export const mfApi = {
    save : data => {
        return axiosInstance.post(`${api}/add`,data)
    },
    getList : () => {
        return axiosInstance.get(`${api}/all?is_active=1&is_deleted=0`)
    },
    getActiveList: () => {
        return axiosInstance.get(`${api}/all?is_active=1&is_deleted=0`)
    },
    getUnactiveList: () => {
        return axiosInstance.get(`${api}/all?is_active=0&is_deleted=0`)
    },
    getDeletedList: () => {
        return  axiosInstance.get(`${api}/all?is_active=0&is_deleted=1`)
    },
    delete : (id, data) => {
        return axiosInstance.put(`${api}/switch/${id}`,data)
    },
    softDelete : (id) => {
        return axiosInstance.delete(`${api}/delete/${id}`);
    },
    edit : (id,data) => {
        return axiosInstance.put(`${api}/update/${id}`,data)
    },
    changeStatus: (id, data) => {
        return axiosInstance.put(`${api}/status/${id}`, data)
    },
    uploadExcel: (data) => axiosInstance.post(`${api}/bulk/upload`, data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
};


// const api = 'http://api.duqum.uz/mf';
// const headers={
//     token:sessionStorage.getItem("token")
// };

// export const mfApi = {
//     save : data => {
//         return axios.post(`${api}/add`,data,{headers})
//     },
//     getList : () => {
//         return axios.get(`${api}/all?is_active=1&is_deleted=0`,{headers})
//     },
//     getActiveList: () => {
//         return axios.get(`${api}/all?is_active=1&is_deleted=0`, {headers})
//     },
//     getUnactiveList: () => {
//         return axios.get(`${api}/all?is_active=0&is_deleted=0`, {headers})
//     },
//     getDeletedList: () => {
//         return  axios.get(`${api}/all?is_active=0&is_deleted=1`, {headers})
//     },
//     delete : (id, data) => {
//         return axios.put(`${api}/switch/${id}`,data,{headers})
//     },
//     edit : (id,data) => {
//         return axios.put(`${api}/update/${id}`,data,{headers})
//     },
//     changeStatus: (id, data) => {
//         return axios.put(`${api}/status/${id}`, data, {headers})
//     }
// };