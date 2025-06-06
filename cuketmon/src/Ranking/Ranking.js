import React, { useState, useEffect } from 'react';
import MenuBar from "../Menubar/Menubar.js";
import './Ranking.css';
import { useAuth } from '../AuthContext';

function Ranking() {
  const [rank, setRank] = useState(0); 
  const [trainerName, setTrainerName] = useState(''); 
  const [winCount, setWinCount] = useState(0);
  const [loseCount, setLoseCount] = useState(0); 
  const [battleCount, setBattleCount] = useState(0);
  const [monsters, setMonsters] = useState([]);  
  const [monsterImages, setMonsterImages] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;
  const { token: contextToken } = useAuth();
  const token = contextToken || localStorage.getItem('jwt');

  /*유저 소유 커켓몬 id 배열로 받기 */
  const loadCukemon = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/trainer/monsters`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      const monsterIds = Array.isArray(data) ? data : [];  
      setMonsters(monsterIds);     
      console.log(monsterIds)            
    } catch (error) {
      console.error("커켓몬 로딩에 실패했습니다.", error.message);
    }
  };
  useEffect(() => {
    loadCukemon();
    const retryTimeout = setTimeout(() => {
      if (!monsters || monsters.length === 0) {
        console.log("몬스터가 비어 있어 재시도합니다.");
        loadCukemon();
      }
    }, 500); 
    return () => clearTimeout(retryTimeout); 
  }, []);

  useEffect(() => {
    if (monsters.length > 0) {
      loadCukemonImages(monsters);
    }
  }, [monsters]);

  /*커켓몬몬 이미지 */
  const loadCukemonImages = async (monsterIds) => {
    try {
      const imagePromises = monsterIds.map(async (monsterId) => {
        const res = await fetch(`${API_URL}/api/monster/${monsterId}/info`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await res.json();
        return data?.image ? data.image : ''; 
      });
      
      const images = await Promise.all(imagePromises); 
      setMonsterImages(images); 
    } catch (error) {
      console.error("커켓몬 이미지 로딩에 실패했습니다.", error.message);
    }
  };



  /*랭킹 */
  useEffect(() => {
    const fetchRankingData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/trainer/ranking`, {
          method: 'GET', 
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        console.log(data)
        setRank(parseInt(data.rank));
        setTrainerName(data.trainerName);
        setWinCount(parseInt(data.win));
        setLoseCount(parseInt(data.lose));
        setBattleCount(parseInt(data.allBattles));
      } catch (error) {
        console.error('랭킹 불러오기 실패', error);
      }
    };
    fetchRankingData();
  }, [API_URL, token]);



  return (
    <div className='ranking'>
      <div className='rankingBoard'>
      <div className="cukemonImageContainer">
      {monsterImages.map((url, idx) => (
       <img key={idx} src={url} alt="우리의 든든한 커켓몬 군단" className="cukemonImage" />
     ))}
      </div>
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
