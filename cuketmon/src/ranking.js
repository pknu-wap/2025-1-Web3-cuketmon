import React, { useState, useEffect } from 'react';
import MenuBar from "./menubar/Menubar.js";
import './ranking.css';

function Ranking() {
  const [Myrank, setMyrank] = useState(0);
  const [BattleCount, setBattleCount] = useState(0);
  const [WinCount, setWinCount] = useState(0);
  const [imageUrl, setImageUrl] = useState(''); 

  useEffect(() => {
    fetch('https://your-backend-api.com/ranking') // 백엔드 API URL 변경
      .then(response => response.json())
      .then(data => {
        setMyrank(data.rank);
        setBattleCount(data.battleCount);
        setWinCount(data.winCount);
        setImageUrl(data.imageUrl); // 이미지 URL 설정
      })
      .catch(error => console.error('Error fetching ranking data:', error));
  }, []);

  return (
    <div className='RankingBoard'>
      {/* 백엔드에서 받은 이미지 표시 */}
      <img src={imageUrl} alt='커켓몬 이미지' className="pokemon-image" />

      <div className='Myrank'>
        <h2>Standing<span id='MyRank'>No.{Myrank}</span></h2>
      </div>
      
      <table className="historyBoard">
        <thead>
          <tr>
            <th>Category</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Wins</td>
            <td>{WinCount}</td>
          </tr>
          <tr>
            <td>Losses</td>
            <td>{BattleCount - WinCount}</td>
          </tr>
        </tbody>
      </table>

      <MenuBar />
    </div>
  );
}

export default Ranking;
