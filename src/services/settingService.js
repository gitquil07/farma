import axiosInstance from "./api";
const api = "/settings";

export const settingsApi = {
    getList : () =>{
        return axiosInstance.get(`${api}/get`)
    },
    edit : (data) => {
        return axiosInstance.put(`${api}/update`,data)
    },
    upload: (data) => {
        return axiosInstance.put(`${api}/upload`, data);
    },
    download: (type) => {
        return axiosInstance.get(`/download/${type}`, {
            responseType: "blob"
        });
    }
};


