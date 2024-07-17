import { useEffect } from 'react';
import axios from 'axios';

export const useAxiosInterceptor = () => {

    useEffect(() => {
        const handleLogout = () => {
            // Clear user data, tokens, etc.
            // I only want to deal with these fields as of now so I'm not using localStorage.clear()
            // Maybe later on I'll have some more values in local storage which I don't want to get cleared on logout
            ['user', 'authenticated', 'token'].forEach(e => localStorage.removeItem(e));

            // Redirect to login page
            window.location.href = '/signin';
        };

        const axiosInstance = axios.create({
            baseURL: process.env.REACT_APP_HOST,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json, text/plain, */*',
            },
            timeout: 30000, // Set a timeout limit (optional)
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

        axiosInstance.interceptors.response.use(
            response => response,
            error => {
                if (error.response && error.response.status === 401) {
                    if (window.location.pathname !== '/signin') handleLogout();
                }
                return Promise.reject(error);
            }
        );

        // Attach axiosInstance to window object for easy access in dev tools and other components & files
        window.axiosInstance = axiosInstance;
    }, []);
};
