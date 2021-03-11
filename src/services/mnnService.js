import axiosInstance from "./api";

const api = '/inn';

export const mnnApi = {
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
