import React, {  useRef, useEffect, useState } from 'react';
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
  const [monsterId, setMonsterId] = useState(null);
  const [monsters, setMonsters] = useState([]); 
  const API_URL = process.env.REACT_APP_API_URL;
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const isLoadingRef = useRef(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  /*유저 소유 커켓몬 조회하기 */
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
    loadCukemon(); //최초 1회 실행 코드 (5/7수정)
  }, []);

  useEffect(() => {
    if (monsters.length > 0 && monsterId === null) {
      setMonsterId(0); //loadcukemon에서 배열 받받아왔으면 인덱스를 0으로 설정하게 (5/7수정)
    }
  }, [monsters]);

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

  /*먹이주기*/
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
      await fetchData(); 
    } catch (err) {
      alert("먹이 주기 실패: " + err.message);
    }
  };

  /*놀아주기*/
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
      await fetchData(); 
    } catch (err) {
      alert("놀아주기 실패: " + err.message);
    }
  };

  /*데이터 업뎃*/
  const fetchData = async () => {
    if (isLoadingRef.current) return;  
    if (!monsters.length || monsterId === undefined) return;
    isLoadingRef.current = true;  
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
      isLoadingRef.current = false; 
    }
  };
  useEffect(() => {
      fetchData();
  }, [monsterId])
  

  /*먹이,놀아 주기 애니메이션*/
  const handleActionClick = async (actionFn, setActionState) => {
    setActionState(true);
    await actionFn();
    setTimeout(() => setActionState(false), 1000);
  };

  /*방출 */
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
      loadCukemon();
    } catch (err) {
      alert("에러 발생: " + err.message);
    }
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'ArrowLeft') {
        setMonsterId((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : monsters.length - 1
        );
      } else if (event.key === 'ArrowRight') {
        setMonsterId((prevIndex) =>
          prevIndex < monsters.length - 1 ? prevIndex + 1 : 0
        );
      }
    };
  
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [monsters]);

  /*커켓몬 정보 불러오기 */ 
  const loadCukemonData = async () => {
    const currentMonsterId = monsters[monsterId];
    console.log("현재 monsterId:", currentMonsterId);
    console.log("monsters 배열:", monsters);
    try {
      const res = await fetch(`${API_URL}/api/monster/${currentMonsterId}/info`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      const parsedId = parseInt(data?.id);
      return {
        img: data?.image ? data.image : '', 
        affinity: parseInt(data?.affinity) || 0,
        id: isNaN(parsedId) ? null : parsedId,
        name: data?.name || "로딩중..",
      };
    } catch (error) {
      console.error("커켓몬 데이터 로딩 실패:", error.message);
      return null;
    }
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
        <img src={cukemonData?.img} alt="Cukemon" id='cuketmonImage' />
      </div>

      <div className='cucketmonProfile'>
        {loading ? <p>로딩 중...</p> : <p>{cukemonData?.name || "이름 없음"}</p>}
        <div id='relevanceCount'>
          <img src='/MyPage/relevance.webp' alt="친밀도 아이콘" />
          <span>{cukemonData?.affinity ?? "로딩중.."}</span>
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
