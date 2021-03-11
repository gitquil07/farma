import axiosInstance from './api';

const api = '/filter/distributors';

export const distributorsApi = {
    getActiveList: (obj) => {
        console.log(obj);
        return axiosInstance.post(`${api}`, obj);
    }
};