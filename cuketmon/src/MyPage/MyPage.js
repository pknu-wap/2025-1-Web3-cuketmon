import React, { useEffect, useState, useRef } from 'react';
import MenuBar from "../Menubar/Menubar.js";
import './MyPage.css';
import { useAuth } from '../AuthContext';

function MyPage() {
  const [toyCount, setToyCount] = useState();
  const [feedCount, setFeedCount] = useState();
  const [isFed, setIsFed] = useState(false);
  const [isPlayed, setIsPlayed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cukemonData, setCukemonData] = useState(null);
  const [trainerName, setTrainerName] = useState(null);
  const [monsterId, setMonsterId] = useState(2);
  const pageRef = useRef(null);

  const API_URL = process.env.REACT_APP_API_URL;
  const { token } = useAuth();

  const fetchData = async () => {
    if (!token) return;

    try {
      setLoading(true);

      const trainerRes = await fetch(`${API_URL}/trainer/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const trainerInfo = await trainerRes.json();
      setTrainerName(trainerInfo.name);

      const toyResponse = await fetch(`${API_URL}/trainer/toys`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const toyData = await toyResponse.json();
      setToyCount(Number(toyData));

      const feedResponse = await fetch(`${API_URL}/trainer/feeds`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const feedData = await feedResponse.json();
      setFeedCount(Number(feedData));

      const cukemonResponse = await fetch(`${API_URL}/monster/${monsterId}/info`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
  }, [monsterId, token]);

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

  const feedCukemon = async () => {
    if (!monsterId || !trainerName) return;

    try {
      const response = await fetch(`${API_URL}/monster/${monsterId}/feed`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.text();
      if (response.ok) {
        alert(result);
        const updatedFeedData = await fetch(`${API_URL}/trainer/${trainerName}/feeds`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const feedData = await updatedFeedData.json();
        setFeedCount(Number(feedData));
      } else {
        throw new Error(result);
      }
    } catch (error) {
      alert(`먹이 주기 실패: ${error.message}`);
    }
  };

  const handleFeedClick = async () => {
    setIsFed(true);
    setTimeout(() => setIsFed(false), 1000);
    await feedCukemon();
  };

  const playCukemon = async () => {
    if (!monsterId || !trainerName) return;

    try {
      const response = await fetch(`${API_URL}/monster/${monsterId}/play`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.text();
      if (response.ok) {
        alert(result);
        const updatedToyData = await fetch(`${API_URL}/trainer/${trainerName}/toys`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const toyData = await updatedToyData.json();
        setToyCount(Number(toyData));
      } else {
        throw new Error(result);
      }
    } catch (error) {
      alert(`놀아주기 실패: ${error.message}`);
    }
  };

  const handlePlayClick = async () => {
    setIsPlayed(true);
    setTimeout(() => setIsPlayed(false), 1000);
    await playCukemon();
  };

  const releaseCukemon = async () => {
    if (!monsterId || !token) return;

    try {
      const response = await fetch(`${API_URL}/monster/${monsterId}/release`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`삭제 실패: ${response.status}`);
      }

      alert('커켓몬이 방출되었습니다.');
    } catch (error) {
      alert(`에러 발생: ${error.message}`);
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

      <div className='cuketmonImage'>
        <img src='/Menubar/egg.png' alt="Cuketmon" />
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
