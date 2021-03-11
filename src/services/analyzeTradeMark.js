import axiosInstance from './api';

const api = '/filter/trademarks';

export const trademarksApi = {
    getActiveList: (obj) => {
        console.log(obj);
        return axiosInstance.post(`${api}`, obj);
    }
};