import axiosInstance from './api';

const api = '/filter/companies';

export const companiesApi = {
    getActiveList: (obj) => {
        console.log(obj);
        return axiosInstance.post(`${api}`, obj);
    }
};