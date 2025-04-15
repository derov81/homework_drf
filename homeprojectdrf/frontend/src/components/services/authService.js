import axios from 'axios';
import * as axiosInstance from "browserslist";

const API_URL = 'http://127.0.0.1:8000/api/users/';
class AuthService   {
    async login(username, password) {
        try {
            const response = await axios.post(API_URL + 'token/', {
                username,
                password
            });


            if (response.data.access) {
                const userData = {
                    username,
                    access: response.data.access,
                    refresh: response.data.refresh
                };
                localStorage.setItem('user', JSON.stringify(userData));

                 // Устанавливаем токен в заголовки для последующих запросов
                 axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.access;
                return userData;
            }
            throw new Error('Токен не получен');
        } catch (error) {
            console.error('Ошибка при входе:', error.response?.data || error.message);
            throw error;
        }
    }

    async register(username, password, email) {
        try {
            const response = await axios.post(API_URL + 'register/', {
                username,
                password,
                email
            });
            return response.data;
        } catch (error) {
            console.error('Ошибка при регистрации:', error.response?.data || error.message);
            throw error;
        }
    }

    logout() {
        localStorage.removeItem('user');
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }

}

export default new  AuthService();