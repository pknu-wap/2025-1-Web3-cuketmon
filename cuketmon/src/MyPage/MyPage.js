import React, { useEffect, useState} from 'react';
import MenuBar from "../Menubar/Menubar.js";
import './MyPage.css';
import { useAuth } from '../AuthContext';

function MyPage() {
  const [toyCount, setToyCount] = useState();
  const [feedCount, setFeedCount] = useState();
  const [setIsFed] = useState(false);
  const [setIsPlayed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cukemonData, setCukemonData] = useState(null);
  const [monsterId, setMonsterId] = useState(2); //test용 코드(일부로 2로 맞춰둠) 무조건 무조건 뺴야함...
  const API_URL = process.env.REACT_APP_API_URL;
  const { token } = useAuth();

  useEffect(() => {
    localStorage.setItem('monsterId', monsterId);
  }, [monsterId]);

  /*먹이, 장난감 기저 상태 불러오기*/
  const loadTrainerData = async () => {
    const [toysResponse, feedsResponse] = await Promise.all([
      fetch(`${API_URL}/api/trainer/toys`), 
      fetch(`${API_URL}/api/trainer/feeds`),
    ])
    const toysOriginalData = await toysResponse.text();
    const feedsOriginalData = await feedsResponse.text();
    return { toys: Number(toysOriginalData), feeds: Number(feedsOriginalData) };
  };

  const feedCukemon = async () => {
    if (!monsterId) return;
    try {
      await fetch(`${API_URL}/api/monster/${monsterId}/feed`, { method: "POST" });
      const newFeedResponse = await fetch(`${API_URL}/api/trainer/feeds`);
      const newFeedData=newFeedResponse.text();
      setFeedCount(Number(newFeedData));
      alert("커켓몬에게 먹이를 주었다!");
    } catch (err) {
      alert("먹이 주기 실패: " + err.message);
    }
  };

  const playCukemon = async () => {
    if (!monsterId) return;
    try {
      await fetch(`${API_URL}/api/monster/${monsterId}/play`, { method: "POST" });
      const newToysResponse = await fetch(`${API_URL}/api/trainer/toys`);
      const newToysData=newToysResponse.text();
      setToyCount(Number(newToysData));
      alert("커켓몬과 놀아주었다!");
    } catch (err) {
      alert("놀아주기 실패: " + err.message);
    }
  };

  /*데이터 업뎃*/
  const fetchData = async () => {
    if (!token || !monsterId) return;
    try {
      setLoading(true);
      const trainerData = await loadTrainerData(); //먹이 장난감 업뎃
      setToyCount(trainerData.toys);  
      setFeedCount(trainerData.feeds);

      const cukemon = await loadCukemonData(); //커켓몬 데이터 없뎃
      setCukemonData(cukemon);
    } catch (error) {
      console.error("데이터 로딩 실패:", error.message);
    } finally {
      setLoading(false);
    }
  };

  /*local storage에 저장된 커켓몬 id 불러오기 */
  useEffect(() => {
    const savedMonsterId = localStorage.getItem('monsterId');
    if (savedMonsterId) {
      setMonsterId(savedMonsterId); 
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [monsterId]);  //몬스터 id가 바뀔때 마다 새로운 data 받아오게함.




  /*먹이,놀아 주기 애니메이션*/
  const handleActionClick = async (actionFn, setActionState) => {
    setActionState(true);
    setTimeout(() => setActionState(false), 1000);
    await actionFn();
  };


  const releaseCukemon = async () => {
    if (!monsterId) return;
    try {
      const res = await fetch(`${API_URL}/api/monster/${monsterId}/release`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`삭제 실패: ${res.status}`);
      alert("커켓몬이 원래 있던곳으로 돌아갔습니다.");
    } catch (err) {
      alert("에러 발생: " + err.message);
    }
  };

  /*desktop 커켓몬 전환 키보드 액션 (추후 수정 예정)*/
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'ArrowLeft') {
        setMonsterId((prevId) => Math.max(1, prevId - 1));
      } else if (event.key === 'ArrowRight') {
        setMonsterId((prevId) => prevId + 1);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  /*커켓몬 데이터 불러오기(이미지를 url로 받게 수정)*/
  const loadCukemonData = async () => {
    const res = await fetch(`${API_URL}/api/monster/${monsterId}/info`);
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
          <>
            <img src='/MyPage/feed.webp' id='feed' alt="밥 아이콘" />
            <span>{feedCount}</span>
            <img src='/MyPage/toy.webp' alt="장난감 아이콘" />
            <span>{toyCount}</span>
          </>
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
