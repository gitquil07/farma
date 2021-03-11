import axiosInstance from './api';

const api = '/filter/drugs/all';

export const allAnalyzeApi = {
    getActiveList: (obj) => {
        console.log(obj);
        return axiosInstance.post(`${api}`, obj);
    }
};