import React from 'react';
import { Link } from 'react-router-dom';  // Link만 사용
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="logo">
        <img src='/egg.png' alt="황금 알 아이콘" />
        <h1>커켓몬</h1>
      </div>
      <p id='slogan'>나만의 몬스터를 찾아 떠나는 여행</p>

      <div className="login">
        <p id='instruction'>
          본 게임은 <img src='/pocketmon_logo.png' id='pocketmon_logo'/>에 영향을 받아 만든 2차 창작 웹 게임입니다.
        </p>
        <Link to='/make'>
          <button>카카오 로그인으로 시작하기</button>
        </Link>
      </div>
    </div>
  );
}

export default App;
