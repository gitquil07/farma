import axiosInstance from './api';

const api = '/filter/get/last';
const apiSidebar = '/filter/get/sum';

export const homeApi = {
    getList: (obj) => {
        return axiosInstance.post(api, obj);
    },
    getAllList: ()=>{
        return axiosInstance.post(apiSidebar)
    }
};