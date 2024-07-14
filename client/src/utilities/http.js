import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_HOST,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*',
    },
    timeout: 10000, // Set a timeout limit (optional)
});

axiosInstance.interceptors.request.use(
    config => {
        // Modify request config before sending the request
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);


export {axiosInstance as httpClient};