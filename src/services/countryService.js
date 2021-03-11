import axiosInstance from "./api";

const api = '/countries';

export const countryApi = {
    save : data => axiosInstance.post(`${api}/add`,data),
    getList : () => axiosInstance.get(`${api}/all?is_active=1&is_deleted=0`),
    getActiveList: () => axiosInstance.get(`${api}/all?is_active=1&is_deleted=0`),
    getUnactiveList: () => axiosInstance.get(`${api}/all?is_active=0&is_deleted=0`),
    getDeletedList: () => axiosInstance.get(`${api}/all?is_active=0&is_deleted=1`),
    delete : (id, data) => axiosInstance.put(`${api}/switch/${id}`,data),
    softDelete : (id) => axiosInstance.delete(`${api}/delete/${id}`),
    edit : (id,data) => axiosInstance.put(`${api}/update/${id}`,data),
    changeStatus: (id, data) => axiosInstance.put(`${api}/status/${id}`, data),
    uploadExcel: (data) => axiosInstance.post(`${api}/bulk/upload`, data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
};
