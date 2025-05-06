import React, { useState, useEffect } from 'react';
import MenuBar from "../Menubar/Menubar.js";
import './Ranking.css';

function Ranking() {
  const [rank, setRank] = useState(0); 
  const [trainerName, setTrainerName] = useState(''); 
  const [winCount, setWinCount] = useState(0);
  const [loseCount, setLoseCount] = useState(0); 
  const [battleCount, setBattleCount] = useState(0);
  const [imageUrl, setImageUrl] = useState('/Menubar/egg.webp'); // 전투 API 사용할 수 있을지 확인 필요
  const API_URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token'); 

  useEffect(() => {
    const fetchRankingData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/ranking`, {
          method: 'GET', 
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();

        console.log(data)
        setRank(data.rank);
        setTrainerName(data.trainerName);
        setWinCount(data.win);
        setLoseCount(data.lose);
        setBattleCount(data.allBattles);
      } catch (error) {
        console.error('Error fetching ranking data:', error);
      }
    };
    fetchRankingData();
  }, [API_URL, token]);

  return (
    <div className='ranking'>
      <div className='rankingBoard'>
        <img src={imageUrl} alt='최근 사용 커켓몬' className="pokemonImage" />
        <table className="historyBoard">
          <thead>
            <tr>
              <th>Standing</th>
              <th>No. {rank}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className='mark1'>Trainer Name</td>
              <td>{trainerName}</td>
            </tr>
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
              <td>{loseCount}</td>
            </tr>
          </tbody>
        </table>
      </div>      
      <MenuBar />
    </div>
  );
}

export default Ranking;
