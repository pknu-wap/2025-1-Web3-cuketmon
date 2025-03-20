import React, { useEffect, useState } from 'react';
import MenuBar from "../Menubar/Menubar.js";
import './MyPage.css';

function MyPage() {
  const [toyCount, setToyCount] = useState(0);
  const [feedCount, setFeedCount] = useState(0);
  const [cuketmonName, setCuketmonName] = useState("");
  const [relevanceCount, setRelevanceCount] = useState(0);
  const [cuketmonImage, setCuketmonImage] = useState("");
  const [isFed, setIsFed] = useState(false);
  const [isPlayed, setIsPlayed] = useState(false); 

  useEffect(() => {
    fetch("http://localhost:5000/mypage-data") // 백엔드 API 주소
      .then(response => response.json())
      .then(data => {
        setToyCount(data.toyCount);
        setFeedCount(data.feedCount);
        setCuketmonName(data.cuketmonName);
        setRelevanceCount(data.relevanceCount);
        setCuketmonImage(data.cuketmonImage); 
      })
      .catch(error => console.error("데이터 가져오기 실패:", error));
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

  return (
    <div className='myPage'>
      <div className='item'>
        <img src='/MyPage/feed.png' id='feed' alt="밥 아이콘"/> <span>{feedCount}</span>
        <img src='/MyPage/toy.png' alt="장난감 아이콘"/> <span>{toyCount}</span>
      </div>
      
      <img 
        src={cuketmonImage } 
        id='cuketmonImage' 
        className={`${isFed ? 'moveImage' : ''} ${isPlayed ? 'shakeImage' : ''}`} 
        alt="커켓몬 이미지"
      />
      <div className='cucketmonProfile'>
        <hr/>
        <p>{cuketmonName} 커켓몬 이름</p>
        <div id='relevanceCount'>
          <img src='/MyPage/relevance.png' />
          <span>{relevanceCount}</span>
        </div>
      </div>
      
      <div className='buttons'>
        <img src='/button.png' id="feedButton" onClick={handleFeedClick}/>
        <span id="buttonText1">먹이주기</span>
        <img src='/button.png' id="playButton" onClick={handlePlayClick}/>
        <span id="buttonText2">놀아주기</span>
      </div>
      <MenuBar />
    </div>
  );
}

export default MyPage;
