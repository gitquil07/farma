import axiosInstance from './api';

const api = '/news';

export const NewsApi = {
    save : data => {
        return axiosInstance.post(`${api}/add`,data)
    },
    getImg : (id) => {
        return axiosInstance.get(`${api}/download/${id}`, {
            responseType: "blob"
        })
    },
    getList : data => {
        console.log('qatta');
        return axiosInstance.post(`${api}/all`, {"is_active": true, "is_deleted": false, ...data})
    },
    getAllList: () => {
        return axiosInstance.post(`${api}/all`, {"is_active": true, "is_deleted": false, limit: 10000 })
    },
    getUnactiveList: data => {
        return axiosInstance.post(`${api}/all`, {"is_active": false, "is_deleted": false, limit: 10000 })
    },
    getDeletedList: data => {
        return  axiosInstance.post(`${api}/all`, {"is_active": false, "is_deleted": true, limit: 10000 })
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
    }
}