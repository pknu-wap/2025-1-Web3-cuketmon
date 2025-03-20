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

  const trainerName = "xami"; ///이거 카카오 로그인으로 받아오게 해야함 

  const pageRef = useRef(null);
  const fetchData = async () => {
    try {
      const toyResponse = await fetch(`/trainer/${trainerName}/toys`);
      const toyData = await toyResponse.json();
      setToyCount(toyData.length); 

      const feedResponse = await fetch(`/trainer/${trainerName}/feeds`);
      const feedData = await feedResponse.json();
      setFeedCount(feedData.length); 

      const cuketmonResponse = await fetch(`/trainer/${trainerName}/cuketmons`);
      const cuketmonData = await cuketmonResponse.json();
      setCuketmonData(cuketmonData);
    } catch (error) {
      console.error('데이터 로드 실패', error);
      setToyCount(0);
      setFeedCount(0);
      setCuketmonData([
        {
          cuketmonName: "커켓몬1",
          relevanceCount: 25,
          cuketmonImage: "/images/cuketmon1.png",
        },
        {
          cuketmonName: "커켓몬2",
          relevanceCount: 15,
          cuketmonImage: "/images/cuketmon2.png",
        },
        {
          cuketmonName: "커켓몬3",
          relevanceCount: 30,
          cuketmonImage: "/images/cuketmon3.png",
        },
      ]);
    }
  };

  useEffect(() => {
    fetchData(); 
  }, []);

  const handleFeedClick = () => {
    setIsFed(true);
    setTimeout(() => {
      setIsFed(false);
    }, 1000);
  };

  const handlePlayClick = () => {
    setIsPlayed(true);
    setTimeout(() => {
      setIsPlayed(false);
    }, 1000);
  };

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

  return (
    <div 
      className='myPage' 
      ref={pageRef}
      onKeyDown={handleKeyPress} 
      tabIndex={0} 
    >
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

      <MenuBar />
    </div>
  );
}

export default MyPage;
