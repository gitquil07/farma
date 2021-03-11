import axiosInstance from "./api";
// http://api.duqum.uz/drugs/all

const apiDrugs = '/drugs';
const apiDfg = '/dfg';
const apiCurrency = '/convert';

//Drugs dori qushish
export const medApi = {
    save : data => {
        return axiosInstance.post(`${apiDrugs}/add`,data)
    },
    getCurrencyList : (data) => {
        return axiosInstance.post(`${apiCurrency}/ccy`, data)
    },
    getList : () => {
        return axiosInstance.get(`${apiDrugs}/all?is_active=1&is_deleted=0`)
    },
    getActiveList: () => {
        return axiosInstance.get(`${apiDrugs}/all?is_active=1&is_deleted=0`)
    },
    getUnactiveList: () => {
        return axiosInstance.get(`${apiDrugs}/all?is_active=0&is_deleted=0`)
    },
    getDeletedList: () => {
        return  axiosInstance.get(`${apiDrugs}/all?is_active=0&is_deleted=1`)
    },
    delete : (id, data) => {
        return axiosInstance.put(`${apiDrugs}/switch/${id}`,data)
    },
    softDelete : (id) => {
        return axiosInstance.delete(`${apiDrugs}/delete/${id}`);
    },
    edit : (id,data) => {
        return axiosInstance.put(`${apiDrugs}/update/${id}`,data)
    },
    changeStatus: (id, data) => {
        return axiosInstance.put(`${apiDrugs}/status/${id}`, data)
    },
    uploadExcel: (data) => axiosInstance.post(`${apiDrugs}/bulk/upload`, data,  {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
};
// dfg api
export const dfgApi = {
    save : data => {
        return axiosInstance.post(`${apiDfg}/add`,data)
    },
    getList : () => {
        return axiosInstance.get(`${apiDfg}/all?is_active=1&is_deleted=0`)
    },
    getActiveList: () => {
        return axiosInstance.get(`${apiDfg}/all?is_active=1&is_deleted=0`)
    },
    getUnactiveList: () => {
        return axiosInstance.get(`${apiDfg}/all?is_active=0&is_deleted=0`)
    },
    getDeletedList: () => {
        return  axiosInstance.get(`${apiDfg}/all?is_active=0&is_deleted=1`)
    },
    delete : (id, data) => {
        return axiosInstance.put(`${apiDfg}/switch/${id}`,data)
    },
    softDelete : (id) => {
        return axiosInstance.delete(`${apiDfg}/delete/${id}`);
    },
    edit : (id,data) => {
        return axiosInstance.put(`${apiDfg}/update/${id}`,data)
    },
    changeStatus: (id, data) => {
        return axiosInstance.put(`${apiDfg}/status/${id}`, data)
    },
    uploadExcel: (data) => axiosInstance.post(`${apiDfg}/bulk/upload`, data,  {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
};


// const apiDrugs = 'http://api.duqum.uz/drugs';
// const apiDfg = 'http://api.duqum.uz/dfg';
// const apiCurrency = 'http://api.duqum.uz/convert';

// const headers={
//     token:sessionStorage.getItem("token")
// };
// //Drugs dori qushish
// export const medApi = {
//     save : data => {
//         return axios.post(`${apiDrugs}/add`,data,{headers})
//     },
//     getCurrencyList : (data) => {
//         return axios.post(`${apiCurrency}/ccy`, data, {headers})
//     },
//     getList : () => {
//         return axios.get(`${apiDrugs}/all?is_active=1&is_deleted=0`,{headers})
//     },
//     getActiveList: () => {
//         return axios.get(`${apiDrugs}/all?is_active=1&is_deleted=0`, {headers})
//     },
//     getUnactiveList: () => {
//         return axios.get(`${apiDrugs}/all?is_active=0&is_deleted=0`, {headers})
//     },
//     getDeletedList: () => {
//         return  axios.get(`${apiDrugs}/all?is_active=0&is_deleted=1`, {headers})
//     },
//     delete : (id, data) => {
//         return axios.put(`${apiDrugs}/switch/${id}`,data,{headers})
//     },
//     edit : (id,data) => {
//         return axios.put(`${apiDrugs}/update/${id}`,data,{headers})
//     },
//     changeStatus: (id, data) => {
//         return axios.put(`${apiDrugs}/status/${id}`, data, {headers})
//     }
// };
// // dfg api
// export const dfgApi = {
//     save : data => {
//         return axios.post(`${apiDfg}/add`,data,{headers})
//     },
//     getList : () => {
//         return axios.get(`${apiDfg}/all?is_active=1&is_deleted=0`,{headers})
//     },
//     getActiveList: () => {
//         return axios.get(`${apiDfg}/all?is_active=1&is_deleted=0`, {headers})
//     },
//     getUnactiveList: () => {
//         return axios.get(`${apiDfg}/all?is_active=0&is_deleted=0`, {headers})
//     },
//     getDeletedList: () => {
//         return  axios.get(`${apiDfg}/all?is_active=0&is_deleted=1`, {headers})
//     },
//     delete : (id, data) => {
//         return axios.put(`${apiDfg}/switch/${id}`,data,{headers})
//     },
//     edit : (id,data) => {
//         return axios.put(`${apiDfg}/update/${id}`,data,{headers})
//     },
//     changeStatus: (id, data) => {
//         return axios.put(`${apiDfg}/status/${id}`, data, {headers})
//     }
// };