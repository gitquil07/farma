import axiosInstance from "./api";

const apiDt = '/dt';
const apiDf = '/df';

// Drug types
export const dtApi = {
    save : data => {
        return axiosInstance.post(`${apiDt}/add`,data)
    },
    getList : () => {
        return axiosInstance.get(`${apiDt}/all?is_active=1&is_deleted=0`)
    },
    getActiveList: () => {
        return axiosInstance.get(`${apiDt}/all?is_active=1&is_deleted=0`)
    },
    getUnactiveList: () => {
        return axiosInstance.get(`${apiDt}/all?is_active=0&is_deleted=0`)
    },
    getDeletedList: () => {
        return  axiosInstance.get(`${apiDt}/all?is_active=0&is_deleted=1`)
    },
    delete : (id, data) => {
        return axiosInstance.put(`${apiDt}/switch/${id}`,data)
    },
    softDelete : (id) => {
        return axiosInstance.delete(`${apiDt}/delete/${id}`);
    },
    edit : (id,data) => {
        return axiosInstance.put(`${apiDt}/update/${id}`,data)
    },
    changeStatus: (id, data) => {
        return axiosInstance.put(`${apiDt}/status/${id}`, data)
    },
    uploadExcel: (data) => axiosInstance.post(`${apiDt}/bulk/upload`, data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
};
// Drug farm
export const dfApi = {
    save : data => {
        return axiosInstance.post(`${apiDf}/add`,data)
    },
    getList : () => {
        return axiosInstance.get(`${apiDf}/all?is_active=1&is_deleted=0`)
    },
    getActiveList: () => {
        return axiosInstance.get(`${apiDf}/all?is_active=1&is_deleted=0`)
    },
    getUnactiveList: () => {
        return axiosInstance.get(`${apiDf}/all?is_active=0&is_deleted=0`)
    },
    getDeletedList: () => {
        return  axiosInstance.get(`${apiDf}/all?is_active=0&is_deleted=1`)
    },
    delete : (id, data) => {
        return axiosInstance.put(`${apiDf}/switch/${id}`,data)
    },
    softDelete : (id) => {
        return axiosInstance.delete(`${apiDf}/delete/${id}`);
    },
    edit : (id,data) => {
        return axiosInstance.put(`${apiDf}/update/${id}`,data)
    },
    changeStatus: (id, data) => {
        return axiosInstance.put(`${apiDf}/status/${id}`, data)
    },
    uploadExcel: (data) => axiosInstance.post(`${apiDf}/bulk/upload`, data,  {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
};


// const apiDt = 'http://api.duqum.uz/dt';
// const apiDf = 'http://api.duqum.uz/df';
// const headers={
//     token:sessionStorage.getItem("token")
// };
// // Drug types
// export const dtApi = {
//     save : data => {
//         return axios.post(`${apiDt}/add`,data,{headers})
//     },
//     getList : () => {
//         return axios.get(`${apiDt}/all?is_active=1&is_deleted=0`,{headers})
//     },
//     getActiveList: () => {
//         return axios.get(`${apiDt}/all?is_active=1&is_deleted=0`, {headers})
//     },
//     getUnactiveList: () => {
//         return axios.get(`${apiDt}/all?is_active=0&is_deleted=0`, {headers})
//     },
//     getDeletedList: () => {
//         return  axios.get(`${apiDt}/all?is_active=0&is_deleted=1`, {headers})
//     },
//     delete : (id, data) => {
//         return axios.put(`${apiDt}/switch/${id}`,data,{headers})
//     },
//     edit : (id,data) => {
//         return axios.put(`${apiDt}/update/${id}`,data,{headers})
//     },
//     changeStatus: (id, data) => {
//         return axios.put(`${apiDt}/status/${id}`, data, {headers})
//     }
// };
// // Drug farm
// export const dfApi = {
//     save : data => {
//         return axios.post(`${apiDf}/add`,data,{headers})
//     },
//     getList : () => {
//         return axios.get(`${apiDf}/all?is_active=1&is_deleted=0`,{headers})
//     },
//     getActiveList: () => {
//         return axios.get(`${apiDf}/all?is_active=1&is_deleted=0`, {headers})
//     },
//     getUnactiveList: () => {
//         return axios.get(`${apiDf}/all?is_active=0&is_deleted=0`, {headers})
//     },
//     getDeletedList: () => {
//         return  axios.get(`${apiDf}/all?is_active=0&is_deleted=1`, {headers})
//     },
//     delete : (id, data) => {
//         return axios.put(`${apiDf}/switch/${id}`,data,{headers})
//     },
//     edit : (id,data) => {
//         return axios.put(`${apiDf}/update/${id}`,data,{headers})
//     },
//     changeStatus: (id, data) => {
//         return axios.put(`${apiDf}/status/${id}`, data, {headers})
//     }
// };