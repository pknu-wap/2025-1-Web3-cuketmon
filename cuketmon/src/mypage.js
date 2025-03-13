import React, { useEffect, useState } from 'react';
import MenuBar from "./menubar/Menubar.js";
import './mypage.css';

function MyPage() {
  const [toyCount, setToyCount] = useState(0);
  const [feedCount, setFeedCount] = useState(0);
  const [cuketmonName, setCuketmonName] = useState("");
  const [relevanceCount, setRelevanceCount] = useState(0);
  const [cuketmonImage, setCuketmonImage] = useState(""); 

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

//      {cuketmonImage && <img src={cuketmonImage}  id='cuketmonImage' alt="쿠켓몬 이미지" />}

  return (
    <div className='myPage'>
      <div className='item'>
        <img src='./feed.png' id='feed' alt="밥 아이콘"/> <span>{feedCount} 개</span>
        <img src='./toy.png' alt="장난감 아이콘"/> <span>{toyCount} 개</span>
      </div>
      
     <img src='/egg.png' id='cuketmonImage'/>
      <div className='cucketmon_profile'>
        <p>{cuketmonName}커켓몬 이름</p>
        <div id='relevanceCount'>
        <img src='/relevance.png'/>
        <span>{relevanceCount}</span>
        </div>
      </div>
      
      <div className='buttons'>
        <button id='FeedButton'>먹이주기</button>
        <button id='PlayButton'>놀아주기</button>
      </div>
      <MenuBar />
    </div>
  );
}

export default MyPage;
