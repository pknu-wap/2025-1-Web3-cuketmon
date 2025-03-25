import React, { useEffect, useState, useRef } from 'react';
import MenuBar from "../Menubar/Menubar.js";
import './MyPage.css';

function MyPage() {
  const [toyCount, setToyCount] = useState(0);
  const [feedCount, setFeedCount] = useState(0);
  const [cuketmonData, setCuketmonData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFed, setIsFed] = useState(false);
  const [isPlayed, setIsPlayed] = useState(false);
  const trainerName = "kng"; // 카카오 로그인으로 받아오기
  const API_URL=process.env.REACT_APP_API_URL; 
  const pageRef = useRef(null);

  const fetchData = async () => {
    try {
      const toyResponse = await fetch(`${API_URL}/trainer/${trainerName}/toys`);
      if (!toyResponse.ok) {
        const errorText = await toyResponse.text();
        console.error('Error response:', errorText);
        return;
      }
      const toyData = await toyResponse.json();
      setToyCount(toyData.length);
  
      const feedResponse = await fetch(`${API_URL}/trainer/${trainerName}/feeds`);
      if (!feedResponse.ok) {
        const errorText = await feedResponse.text();
        console.error('Error response:', errorText);
        return;
      }
      const feedData = await feedResponse.json();
      setFeedCount(feedData.length);
  
      const cuketmonResponse = await fetch(`${API_URL}/trainer/${trainerName}/cuketmons`);
      if (!cuketmonResponse.ok) {
        const errorText = await cuketmonResponse.text();
        console.error('Error response:', errorText);
        return;
      }
      const cuketmonData = await cuketmonResponse.json();
      setCuketmonData(cuketmonData);
    } catch (error) {
      console.error('데이터 로드 실패', error);
    }
  };
  

  useEffect(() => {
    fetchData();
  }, []);


  /*먹이주기 */
  const feedCukemon = async (monsterId) => {
    monsterId=2; 
    const trainerName = "kng"; // 카카오 로그인으로 받아오기
    console.log("현재 monsterId:", monsterId);
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
        const updatedFeedData = await (await fetch(`${API_URL}/trainer/${trainerName}/feeds`)).json();
        setFeedCount(updatedFeedData.length);
      } else {
        throw new Error(result);
      }
    } catch (error) {
      alert(`먹이 주기 실패: ${error.message}`);
    }
  };

  /*먹이주기 업데이트*/
  const handleFeedClick = async () => {
    const monsterId = cuketmonData[currentIndex]?.id; 
    setIsFed(true);
    setTimeout(() => {
      setIsFed(false);
    }, 1000);
    await feedCukemon(monsterId);
  };

  /*놀아주기*/
  const playCukemon = async (monsterId) => {
    monsterId=2;
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
        setToyCount(updatedToyData.length);
      } else {
        throw new Error(result);
      }
    } catch (error) {
      alert(`놀아주기 실패: ${error.message}`);
    }
  };
  

  /*놀기 업데이트*/
  const handlePlayClick = async () => {
    const monsterId = cuketmonData[currentIndex]?.id;
    setIsPlayed(true);
    setTimeout(() => {
      setIsPlayed(false);
    }, 1000);
    await playCukemon(monsterId);
  };

  /*키보드 방향키로 포켓몬 조회 구현*/
  const handleKeyPress = (e) => {
    if (e.key === "ArrowRight") {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % cuketmonData.length);
    } else if (e.key === "ArrowLeft") {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + cuketmonData.length) % cuketmonData.length);
    }
  };

  useEffect(() => {
    if (pageRef.current) {
      pageRef.current.focus();
    }
  }, []);

  const { cuketmonName, relevanceCount, cuketmonImage } = cuketmonData[currentIndex] || {};

  /*커켓몬 삭제*/
  const releaseCukemon = async (monsterId) => {
    if (!monsterId) {
      alert("몬스터 ID가 없습니다.");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/monster/${monsterId}/release`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error(`삭제 실패: ${response.status}`);
      }
      setCuketmonData((prevData) => prevData.filter((monster) => monster.id !== monsterId));
    } catch (error) {
      alert("에러 발생:", error);
    }
  };

  return (
    <div className='myPage' ref={pageRef} onKeyDown={handleKeyPress} tabIndex={0}>
      <div className='item'>
        <img src='/MyPage/feed.png' id='feed' alt="밥 아이콘" /> <span>{feedCount}</span>
        <img src='/MyPage/toy.png' alt="장난감 아이콘" /> <span>{toyCount}</span>
      </div>

      <img
        src={cuketmonImage}
        id='cuketmonImage'
        className={`${isFed ? 'moveImage' : ''} ${isPlayed ? 'shakeImage' : ''}`}
        alt="커켓몬 이미지"
      />

      <div className='cucketmonProfile'>
        <p>{cuketmonName}</p>
        <div id='relevanceCount'>
          <img src='/MyPage/relevance.png' alt="친밀도 아이콘" />
          <span>{relevanceCount}</span>
        </div>
      </div>

      <div className='buttons'>
        <img src='/button.png' id="feedButton" onClick={handleFeedClick} />
        <span id="buttonText1">먹이주기</span>
        <img src='/button.png' id="playButton" onClick={handlePlayClick} />
        <span id="buttonText2">놀아주기</span>
      </div>

      <img src='/MyPage/releaseButton.png' id="releaseButton" onClick={() => releaseCukemon(cuketmonData[currentIndex]?.id)} />

      <MenuBar />
    </div>
  );
}

export default MyPage;
