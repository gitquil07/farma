import axiosInstance from './api';

const api = '/filter/drugs/forms';

export const drugFormApi = {
    getActiveList: (obj) => {
        console.log(obj);
        return axiosInstance.post(`${api}`, obj);
    }
};