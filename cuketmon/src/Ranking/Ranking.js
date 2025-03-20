import React, { useState, useEffect } from 'react';
import MenuBar from "../Menubar/Menubar.js";
import './Ranking.css';

function Ranking() {
  const [Myrank, setMyrank] = useState(0);
  const [battleCount, setBattleCount] = useState(0);
  const [winCount, setWinCount] = useState(0);
  const [imageUrl, setImageUrl] = useState(''); 

  useEffect(() => {
    fetch('https://your-backend-api.com/ranking') // 백엔드 API URL 변경
      .then(response => response.json())
      .then(data => {
        setMyrank(data.rank);
        setBattleCount(data.battleCount);
        setWinCount(data.winCount);
        setImageUrl(data.imageUrl); 
      })
      .catch(error => console.error('Error fetching ranking data:', error));
  }, []);

  return (
    <div>
    <div className='rankingBoard'>
      {/* 백엔드에서 받은 이미지 표시 */}
      <img src={imageUrl} alt='커켓몬 이미지' className="pokemonImage" />
  <table className="historyBoard">
    <thead>
      <tr>
        <th>Standing</th>
        <th>No. {Myrank}</th>
      </tr>
    </thead>
    <tbody>
  <tr>
    <td className='mark1'>No. of Battles</td>
    <td>{battleCount}</td>
  </tr>
  <tr>
    <td className='mark2'>Wins</td>
    <td>{winCount}</td>
  </tr>
  <tr>
    <td className='mark3'>Losses</td>
    <td>{battleCount - winCount}</td>
  </tr>
</tbody>
  </table>
    </div>      
    <MenuBar />
    </div>
  );
}

export default Ranking;
