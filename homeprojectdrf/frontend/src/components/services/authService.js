import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/';

class AuthService {
  async login(username, password) {
    try {
      const response = await axios.post(`${API_URL}token/`, {
        username,
        password,
      });

      if (response.data.access) {
        const userData = {
          username,
          access: response.data.access,
          refresh: response.data.refresh,
        };

        localStorage.setItem('user', JSON.stringify(userData));
        // Устанавливаем токен для всех будущих запросов
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.access;

        return userData;
      }
      throw new Error('Не удалось получить токен');
    } catch (error) {
      console.error('Ошибка при входе:', error.response?.data || error.message);
      throw error;
    }
  }

  async register(username, password, email) {
    try {
      const response = await axios.post(`${API_URL}register/`, {
        username,
        password,
        email,
      });


      // После успешной регистрации — сразу логинимся
      return this.login(username, password);
    } catch (error) {
      // Если пользователь уже есть, тоже пытаемся логин
      if (
        error.response?.data?.detail &&
        error.response.data.detail.includes('уже существует')
      ) {
        return this.login(username, password);
      }

      console.error('Ошибка при регистрации:', error.response?.data || error.message);
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}

export default new AuthService();