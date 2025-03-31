import React, { useState } from 'react';
import axios from 'axios';
import '../components/Login/Login.css';

const Login = ({ onLoginSuccess, show, setShowLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Если форма не должна отображаться, возвращаем null
    if (!show) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
        if (isLogin) {
            // Вход
            console.log('Отправка данных для входа:', {  // Для отладки
                username: formData.username,
                password: formData.password
            });

            const response = await axios.post('http://127.0.0.1:8000/api/token/', {
                username: formData.username,
                password: formData.password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('Ответ сервера:', response.data); // Для отладки

            if (!response.data.access) {
                throw new Error('Токен не получен');
            }

            // Сохраняем токены
            localStorage.setItem('token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);

            // Сохраняем информацию о пользователе
            const userData = {
                username: formData.username,
                token: response.data.access
            };

            localStorage.setItem('user', JSON.stringify(userData));
            console.log('Сохраненные данные:', userData); // Для отладки

            onLoginSuccess(userData);
            setShowLogin(false);
        } else {
            // Регистрация
            if (!formData.email) {
                throw new Error('Email обязателен для регистрации');
            }

            console.log('Отправка данных для регистрации:', {  // Для отладки
                username: formData.username,
                password: formData.password,
                email: formData.email
            });

            // Сначала регистрируем пользователя
            await axios.post('http://127.0.0.1:8000/api/register/', {
                username: formData.username,
                password: formData.password,
                email: formData.email
            });

            // После успешной регистрации выполняем вход
            const loginResponse = await axios.post('http://127.0.0.1:8000/api/token/', {
                username: formData.username,
                password: formData.password
            });

            localStorage.setItem('token', loginResponse.data.access);
            localStorage.setItem('refresh_token', loginResponse.data.refresh);

            const userData = {
                username: formData.username,
                token: loginResponse.data.access
            };

            localStorage.setItem('user', JSON.stringify(userData));

            onLoginSuccess(userData);
            setShowLogin(false);
        }
    } catch (error) {
        console.error('Ошибка:', error.response || error);
        let errorMessage = 'Произошла ошибка при авторизации';

        if (error.response) {
            if (error.response.status === 401) {
                errorMessage = 'Неверное имя пользователя или пароль';
            } else {
                errorMessage = error.response.data.detail || error.response.data.error || errorMessage;
            }
        }

        setError(errorMessage);
    } finally {
        setLoading(false);
    }
};

    return (
        <>
            <div className="modal-backdrop" onClick={() => setShowLogin(false)} />
            <div className="login-modal">
                <button
                    className="close-button"
                    onClick={() => setShowLogin(false)}
                >
                    ✕
                </button>

                <h2>{isLogin ? 'Вход в систему' : 'Регистрация'}</h2>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Имя пользователя:</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {!isLogin && (
                        <div className="form-group">
                            <label>Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label>Пароль:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="submit-button"
                        disabled={loading}
                    >
                        {loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
                    </button>

                    <button
                        type="button"
                        className="toggle-button"
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin ? 'Создать новый аккаунт' : 'Уже есть аккаунт? Войти'}
                    </button>
                </form>
            </div>
        </>
    );
};

export default Login;