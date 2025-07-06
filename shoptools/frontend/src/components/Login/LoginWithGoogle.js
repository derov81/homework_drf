import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const LoginWithGoogle = () => {

  const handleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;

    try {
      const res = await axios.post('http://127.0.0.1:8000/api/google-login/', {
        token: token,
      });

      const user = res.data;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', user.access);

      console.log('✅ Авторизация прошла успешно:', user);
    } catch (err) {
      console.error('❌ Ошибка авторизации:', err.response?.data || err.message);
    }
  };

  return (
    <div>
      {/*<h3>Войти через Google</h3>*/}
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.log('Ошибка Google входа')}
      />
    </div>
  );
};

export default LoginWithGoogle;
