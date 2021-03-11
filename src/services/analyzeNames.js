import axiosInstance from './api';

const api = '/filter/drugs/names';

export const namesApi = {
    getActiveList: (obj) => {
        console.log(obj);
        return axiosInstance.post(`${api}`, obj);
    }
};