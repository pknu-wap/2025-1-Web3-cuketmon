import React, { useState, useEffect } from 'react';
import MenuBar from "../Menubar/Menubar.js";
import './Ranking.css';

function Ranking() {
  const [Myrank, setMyrank] = useState(0);
  const [battleCount, setBattleCount] = useState(0);
  const [winCount, setWinCount] = useState(0);
  const [imageUrl, setImageUrl] = useState('/Menubar/egg.png');


  const trainerName = "xami"; //임시로 xami로 둠. 나중에 카카오 로그인 연동 후 각 사용자 이름을 받아오게 만들것!!
  useEffect(() => {
    fetch(`/${trainerName}/rank`) 
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
    <div className='ranking'>
    <div className='rankingBoard'>
      <img src={imageUrl} alt='최근 사용 커켓몬' className="pokemonImage" />
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
