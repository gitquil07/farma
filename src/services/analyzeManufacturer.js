import axiosInstance from './api';

const api = '/filter/manufacturers';

export const manufacturersApi = {
    getActiveList: (obj) => {
        console.log(obj);
        return axiosInstance.post(`${api}`, obj);
    }
};