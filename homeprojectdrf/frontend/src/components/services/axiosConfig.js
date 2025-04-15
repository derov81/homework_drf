import axios from 'axios';

axios.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.access) {
            config.headers['Authorization'] = 'Bearer ' + user.access;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);