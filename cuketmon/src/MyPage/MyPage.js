import React, { useEffect, useState, useRef } from 'react';
import MenuBar from "../Menubar/Menubar.js";
import './MyPage.css';

function MyPage() {
  const [toyCount, setToyCount] = useState();
  const [feedCount, setFeedCount] = useState();
  const [isFed, setIsFed] = useState(false);
  const [isPlayed, setIsPlayed] = useState(false);
  const [loading, setLoading] = useState(true); 
  const [cukemonData, setCukemonData] = useState(null);
  
  const trainerName = "kng"; // 카카오 로그인으로 받아오기
  const API_URL = process.env.REACT_APP_API_URL;
  const pageRef = useRef(null);
  const monsterId = 2;

  const fetchData = async () => {
    try {
      setLoading(true);
      const toyResponse = await fetch(`${API_URL}/trainer/${trainerName}/toys`);
      const toyData = await toyResponse.json();
      console.log("Toy Data:", toyData); 
      setToyCount(Number(toyData));

      const feedResponse = await fetch(`${API_URL}/trainer/${trainerName}/feeds`);
      const feedData = await feedResponse.json();
      console.log("Feed Data:", feedData); 
      setFeedCount(Number(feedData)); 

      const cukemonResponse=await fetch(`${API_URL}/monster/${monsterId}/info`);
      const cukemonData = await cukemonResponse.json();
      setCukemonData(cukemonData);

    } catch (error) {
      console.error('데이터 로드 실패', error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchData(); 
  }, []);

  // 먹이주기
  const feedCukemon = async () => {
    if (!monsterId) {
      alert("몬스터 ID가 없습니다.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/monster/${monsterId}/feed`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.text();

      if (response.ok) {
        alert(result);
        const updatedFeedData = await fetch(`${API_URL}/trainer/${trainerName}/feeds`);
        const feedData = await updatedFeedData.json();
        setFeedCount(Number(feedData));
      } else {
        throw new Error(result);
      }
    } catch (error) {
      alert(`먹이 주기 실패: ${error.message}`);
    }
  };

  // 먹이주기 버튼 클릭 처리
  const handleFeedClick = async () => {
    setIsFed(true);
    setTimeout(() => {
      setIsFed(false);
    }, 1000);
    await feedCukemon();
  };

  // 놀아주기
  const playCukemon = async () => {
    if (!monsterId) {
      alert("몬스터 ID가 없습니다.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/monster/${monsterId}/play`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.text();

      if (response.ok) {
        alert(result);
        const updatedToyData = await (await fetch(`${API_URL}/trainer/${trainerName}/toys`)).json();
        setToyCount(updatedToyData);
      } else {
        throw new Error(result);
      }
    } catch (error) {
      alert(`놀아주기 실패: ${error.message}`);
    }
  };

  // 놀아주기 버튼 클릭 처리
  const handlePlayClick = async () => {
    setIsPlayed(true);
    setTimeout(() => {
      setIsPlayed(false);
    }, 1000);
    await playCukemon();
  };

  // 커켓몬 방출
  const releaseCukemon = async () => {
    if (!monsterId) {
      alert("몬스터 ID가 없습니다.");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/monster/${monsterId}/release`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error(`삭제 실패: ${response.status}`);
      }
      alert('커켓몬이 방출되었습니다.');
    } catch (error) {
      alert("에러 발생:", error);
    }
  };

  useEffect(() => {
    if (pageRef.current) {
      pageRef.current.focus();
    }
  }, []);

  return (
    <div className='myPage' ref={pageRef} tabIndex={0}>
      <div className='item'>
        {loading ? (
          <span>로딩 중...</span>
        ) : (
          <>
            <img src='/MyPage/feed.png' id='feed' alt="밥 아이콘" />
            <span>{feedCount}</span>
            <img src='/MyPage/toy.png' alt="장난감 아이콘" />
            <span>{toyCount}</span>
          </>
        )}
      </div>

     <div className='cucketmonProfile'>
     {loading ? <p>로딩 중...</p> : <p>{cukemonData?.name || "이름 없음"}</p>}
     <div id='relevanceCount'>
     <img src='/MyPage/relevance.png' alt="친밀도 아이콘" />
     <span>{cukemonData?.affinity ?? 0}</span>
     </div>
     </div>

      <div className='buttons'>
        <img src='/button.png' id="feedButton" onClick={handleFeedClick} />
        <span id="buttonText1">먹이주기</span>
        <img src='/button.png' id="playButton" onClick={handlePlayClick} />
        <span id="buttonText2">놀아주기</span>
      </div>

      <img src='/MyPage/releaseButton.png' id="releaseButton" onClick={releaseCukemon} /> 

      <MenuBar />
    </div>
  );
}

export default MyPage;
