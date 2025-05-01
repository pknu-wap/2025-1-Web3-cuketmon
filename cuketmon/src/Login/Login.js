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
    console.log(token)

    if (token) {
      localStorage.setItem('accessToken', token); 

      fetch(`${API_URL}/trainer/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  
        },
        body: JSON.stringify({ token }),  
      })
      .then(response => response.json())
      .then(data => {
        console.log('백엔드 응답:', data);  
        navigate('/make');
      })
      .catch(error => {
        console.error('백엔드 요청 오류:', error); 
      });
    } else {
      console.error('Token 값이 존재하지 않습니다.');
    }
  }, [navigate, API_URL, setToken]);

  return (
    <div className="login">
        <img src="../LoginPage/logo.png" id="webLogo" alt="웹 로고" />
        <button className="kakaoButton" onClick={handleLogin}>
            카카오 로그인으로 시작하기
        </button>
    </div>

  );
}

export default Login;
