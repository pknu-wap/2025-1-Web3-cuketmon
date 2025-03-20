import React from 'react';
import { Link } from 'react-router-dom';  
import './App.css';

function App() {
  return (
    <div className="App">
      <img src='/LoginPage/logo.png' id='webLogo' alt="웹 로고"/>
      <Link to='/make' className="buttonContainer">
          <span className="buttonText">카카오 로그인으로 시작하기</span>
          <img src='/button.png' alt="카카오 로그인 버튼" className="buttonImage"/>
      </Link>
    </div>
  );
}

export default App;
