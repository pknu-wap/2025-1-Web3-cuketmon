import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  
import './Login.css';
import { useAuth } from '../AuthContext';
import PokeStyleButton from '../common/PokeStyleButton/PokeStyleButton.js'

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

    if (token) {
      localStorage.setItem('accessToken', token); 
      setToken(token); 
      window.history.replaceState({}, document.title, "/make");
      navigate('/make', { replace: true });
    } else {
      console.error('Token 값이 존재하지 않습니다.');
    }
  }, [navigate, setToken]);

  return (
    <div className="login">
      <img src="../LoginPage/logo.webp" id="webLogo" alt="웹 로고" />
      <div className='loginButton'>
      <PokeStyleButton label={"카카오 로그인으로 시작"} onClick={handleLogin}/>
      </div>
    </div>
  );
}

export default Login;
