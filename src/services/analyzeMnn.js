import axiosInstance from './api';

const api = '/filter/inn';

export const MNNApi = {
    getActiveList: (obj) => {
        console.log(obj);
        return axiosInstance.post(`${api}`, obj);
    }
};