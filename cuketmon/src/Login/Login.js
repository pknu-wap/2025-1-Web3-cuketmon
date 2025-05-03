import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  
import './Login.css';
import { useAuth } from '../AuthContext';

function Login() {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;
  const { setToken } = useAuth(); 

  const handleLogin = () => {
    window.location.href = `${API_URL}/oauth2/authorization/kakao`;
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token'); 
    console.log('카카오 로그인 후 받은 토큰:', token);

    if (token) {
      localStorage.setItem('accessToken', token); 
      setToken(token); 
      navigate('/make');
    } else {
      console.error('Token 값이 존재하지 않습니다.');
    }
  }, [navigate, API_URL, setToken]);

  return (
    <div className="login">
      <img src="../LoginPage/logo.webp" id="webLogo" alt="웹 로고" />
      <button className="kakaoButton" onClick={handleLogin} />
      <span id='loginStart'>카카오 로그인으로 시작</span> 
    </div>
  );
}

export default Login;
