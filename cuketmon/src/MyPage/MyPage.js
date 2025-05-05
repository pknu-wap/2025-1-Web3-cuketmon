import React, { useEffect, useState } from 'react';
import MenuBar from "../Menubar/Menubar.js";
import './MyPage.css';
import { useAuth } from '../AuthContext';

function MyPage() {
  const [toyCount, setToyCount] = useState();
  const [feedCount, setFeedCount] = useState();
  const [isFed,setIsFed] = useState(false);
  const [isPlayed, setIsPlayed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cukemonData, setCukemonData] = useState(null);
  const [monsterId, setMonsterId] = useState();
  const [monsters, setMonsters] = useState([]); 
  const API_URL = process.env.REACT_APP_API_URL;
  const { token } = useAuth();


  /*유저 소유 커켓몬 조회하기 */
  const loadCukemon = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/trainer/monsters`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      const monsterIds = Array.isArray(data.id) ? data.id : [data.id];
      setMonsters(monsterIds);     
      setMonsterId(0);             
    } catch (error) {
      console.error("커켓몬 로딩에 실패했습니다.", error.message);
    }
  };
  useEffect(() => {
    loadCukemon();
  }, []);

  /*먹이, 장난감 기저 상태 불러오기*/
  const loadTrainerData = async () => {
    const [toysResponse, feedsResponse] = await Promise.all([
      fetch(`${API_URL}/api/trainer/toys`, {
        headers: { 'Authorization': `Bearer ${token}` },
      }),
      fetch(`${API_URL}/api/trainer/feeds`, {
        headers: { 'Authorization': `Bearer ${token}` },
      }),
    ]);
    const toysOriginalData = await toysResponse.text();
    const feedsOriginalData = await feedsResponse.text();
    return { toys: Number(toysOriginalData), feeds: Number(feedsOriginalData) };
  };

  const feedCukemon = async () => {
    if (!monsterId || monsters.length === 0) return;
    try {
      const currentMonsterId = monsters[monsterId]; 
      await fetch(`${API_URL}/api/monster/${currentMonsterId}/feed`, {
        method: "POST",
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const newFeedResponse = await fetch(`${API_URL}/api/trainer/feeds`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const newFeedData = await newFeedResponse.text();
      setFeedCount(Number(newFeedData));
      alert("커켓몬에게 먹이를 주었다!");
    } catch (err) {
      alert("먹이 주기 실패: " + err.message);
    }
  };

  const playCukemon = async () => {
    if (!monsterId || monsters.length === 0) return;
    try {
      const currentMonsterId = monsters[monsterId]; 
      await fetch(`${API_URL}/api/monster/${currentMonsterId}/play`, {
        method: "POST",
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const newToysResponse = await fetch(`${API_URL}/api/trainer/toys`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const newToysData = await newToysResponse.text();
      setToyCount(Number(newToysData));
      alert("커켓몬과 놀아주었다!");
    } catch (err) {
      alert("놀아주기 실패: " + err.message);
    }
  };

  /*데이터 업뎃*/
  const fetchData = async () => {
    try {
      setLoading(true);
      const trainerData = await loadTrainerData(); 
      setToyCount(trainerData.toys);  
      setFeedCount(trainerData.feeds);

      const cukemon = await loadCukemonData(); 
      setCukemonData(cukemon);
    } catch (error) {
      console.error("데이터 로딩 실패:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('현재 MonsterId:', monsterId);
    fetchData();

  }, [monsterId]);  

  /*먹이,놀아 주기 애니메이션*/
  const handleActionClick = async (actionFn, setActionState) => {
    setActionState(true);
    await actionFn();
    setTimeout(() => setActionState(false), 1000);
  };

  const releaseCukemon = async () => {
    if (!monsterId || monsters.length === 0) return;
    try {
      const currentMonsterId = monsters[monsterId]; 
      const res = await fetch(`${API_URL}/api/monster/${currentMonsterId}/release`, {
        method: "DELETE",
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`삭제 실패: ${res.status}`);
      alert("커켓몬이 원래 있던곳으로 돌아갔습니다.");
    } catch (err) {
      alert("에러 발생: " + err.message);
    }
  };

  /*desktop 커켓몬 전환 키보드 액션*/
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'ArrowLeft') {
        setMonsterId((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : 0
        );
      } else if (event.key === 'ArrowRight') {
        setMonsterId((prevIndex) =>
          prevIndex < monsters.length - 1 ? prevIndex + 1 : prevIndex
        );
      }
    };
  
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [monsters]);

  const loadCukemonData = async () => {
    if (monsters.length === 0 || monsterId === undefined) return;
    const currentMonsterId = monsters[monsterId]; 
    const res = await fetch(`${API_URL}/api/monster/${currentMonsterId}/info`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const data = await res.json();
    return {
      img: data?.image || '/Menubar/egg.png',  
      affinity: parseInt(data?.affinity) || 0,  
      id: parseInt(data?.id) || "정보 없음",  
      name: data?.name || "이름 없음",  
    };
  };

  return (
    <div className='myPage'>
      <div className='item'>
        {loading ? (
          <span>로딩 중...</span>
        ) : (
          <div>
            <img src='/MyPage/feed.webp' id='feed' alt="밥 아이콘" />
            <span>{feedCount}</span>
            <img src='/MyPage/toy.webp' alt="장난감 아이콘" />
            <span>{toyCount}</span>
          </div>
        )}
      </div>

      <div className='cukemonImg'>
        <img src={cukemonData?.img || '/Menubar/egg.webp'} alt="Cukemon" id='cuketmonImage' />
      </div>

      <div className='cucketmonProfile'>
        {loading ? <p>로딩 중...</p> : <p>{cukemonData?.name || "이름 없음"}</p>}
        <div id='relevanceCount'>
          <img src='/MyPage/relevance.webp' alt="친밀도 아이콘" />
          <span>{cukemonData?.affinity ?? "정보 없음"}</span>
        </div>
      </div>

      <div className="buttons">
        <button id="feedButton" onClick={() => handleActionClick(feedCukemon, setIsFed)} />
        <button id="playButton" onClick={() => handleActionClick(playCukemon, setIsPlayed)} />
      </div>
      <span id="buttonText1">먹이주기</span>
      <span id="buttonText2">놀아주기</span>

      <img src='/MyPage/releaseButton.webp' id="releaseButton" onClick={releaseCukemon} />
      <MenuBar />
    </div>
  );
}

export default MyPage;
