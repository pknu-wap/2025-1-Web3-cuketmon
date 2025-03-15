import React, { useState } from 'react';
import './Make.css';
import MenuBar from "./menubar/Menubar.js";

function Make() {
  const [type1, setType1] = useState('풀');
  const [type2, setType2] = useState('불꽃');
  const [features, setFeatures] = useState('');

  function handleCreate() {
    if (type1 && type2 && features) {
      alert(`커켓몬 (타입: ${type1} , ${type2})\n특징: ${features} 생성!`);
    } else {
      alert('타입, 특징을 모두 입력해주세요!');
    }
  }

  return (
    <div className="make-container">
      <img src="/mk1background.png" alt="배경화면" className="background-image" />
      <div className="input-section">
        <label1>원하시는 포켓몬의 타입을 적어주세요</label1>
        <select value={type1} onChange={(e) => setType1(e.target.value)}>
          <option value="불꽃">불꽃</option>
          <option value="물">물</option>
          <option value="풀">풀</option>
        </select>
        <select value={type2} onChange={(e) => setType2(e.target.value)}>
          <option value="불꽃">불꽃</option>
          <option value="물">물</option>
          <option value="풀">풀</option>
        </select>
        <label2>원하시는 포켓몬의 특징을 적어주세요</label2>
        <textarea
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
          placeholder="특징을 입력하세요 (예: 빨간 꼬리, 빠른 속도)"
          rows="4"
        />
        <button onClick={handleCreate}>생성</button>
      </div>
      <MenuBar />
    </div>
  );
}

export default Make;