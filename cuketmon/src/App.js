import React from 'react';
import { Link } from 'react-router-dom';  
import './App.css';

function App() {
  return (
    <div className="App">
      <img src='/logo.png' id='weblogo' alt="웹 로고"/>
      <Link to='/make' className="button-container">
          <span className="button-text">카카오 로그인으로 시작하기</span>
          <img src='/button.png' alt="카카오 로그인 버튼" className="button-image"/>
      </Link>
    </div>
  );
}

export default App;
