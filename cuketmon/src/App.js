import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  
import './App.css';

function App() {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const handleLogin = () => {
    window.location.href = "http://ec2-3-34-197-50.ap-northeast-2.compute.amazonaws.com:8000/oauth2/authorization/kakao";
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get('code');  

    if (code) {
      fetch(`${API_URL}/getKakaoToken`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),  
      })
      .then(response => response.json())
      .then(data => {
        const jwt = data.jwt;  
        console.log('JWT:', jwt);

        localStorage.setItem('jwt', jwt); 

        fetch(`${API_URL}/trainer/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`,  
          },
          body: JSON.stringify({ token: jwt }),  
        })
        .then(response => response.json())
        .then(data => {
          console.log('백엔드 응답:', data);  
          navigate('/make');  
        })
        .catch(error => {
          console.error('백엔드 요청 오류:', error); 
        });
      })
      .catch(error => {
        console.error('카카오 토큰 요청 오류:', error); 
      });
    } else {
      console.error('Code 값이 존재하지 않습니다.');
    }
  }, [navigate, API_URL]);

  return (
    <div className="App">
      <img src='/LoginPage/logo.png' id='webLogo' alt="웹 로고" />
      <div onClick={handleLogin} className="buttonContainer" display='None'> 
        <span className="buttonText">카카오 로그인으로 시작하기</span>
        <img src='/button.png' alt="카카오 로그인 버튼" className="buttonImage" />
      </div>
    </div>
  );
}

export default App;
