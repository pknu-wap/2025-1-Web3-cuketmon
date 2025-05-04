import React, { useEffect, useState, useRef } from 'react';
import MenuBar from "../Menubar/Menubar.js";
import './MyPage.css';
import { useAuth } from '../AuthContext';

function MyPage() {
  const [toyCount, setToyCount] = useState(0);
  const [feedCount, setFeedCount] = useState(0);
  const [isFed, setIsFed] = useState(false);
  const [isPlayed, setIsPlayed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cukemonData, setCukemonData] = useState(null);
  const [trainerName, setTrainerName] = useState(null);
  const [monsterId, setMonsterId] = useState();
  const pageRef = useRef(null);

  const API_URL = process.env.REACT_APP_API_URL;
  const { token } = useAuth();

  useEffect(() => {
    localStorage.setItem('monsterId', monsterId);
  }, [monsterId]);

  const fetchWithAuth = async (url, token, options = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  };

  const loadTrainerData = async () => {
    const [toys, feeds] = await Promise.all([
      fetchWithAuth(`${API_URL}/api/trainer/toys`, token),
      fetchWithAuth(`${API_URL}/api/trainer/feeds`, token),
    ]);
    return { toys: Number(toys), feeds: Number(feeds) };
  };

  const loadCukemonData = async () => {
    const res = await fetchWithAuth(`${API_URL}/api/monster/${monsterId}/info`, token);
    return {
      img: res.image ? `data:image/png;base64,${res.image}` : '/Menubar/egg.png',
      affinity: parseInt(res?.affinity) || 0,
      id: parseInt(res?.id) || 0,
      name: res?.name || "이름 없음",
    };
  };

  const fetchData = async () => {
    if (!token || !monsterId) return;
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
    fetchData();
  }, [monsterId]);

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
      await fetchWithAuth(`${API_URL}/api/monster/${monsterId}/feed`, token, { method: "POST" });
      const newFeed = await fetchWithAuth(`${API_URL}/api/trainer/${trainerName}/feeds`, token);
      setFeedCount(Number(newFeed));
      alert("먹이를 주었습니다!");
    } catch (err) {
      alert("먹이 주기 실패: " + err.message);
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
      await fetchWithAuth(`${API_URL}/api/monster/${monsterId}/play`, token, { method: "POST" });
      const newToys = await fetchWithAuth(`${API_URL}/api/trainer/${trainerName}/toys`, token);
      setToyCount(Number(newToys));
      alert("놀아주었습니다!");
    } catch (err) {
      alert("놀아주기 실패: " + err.message);
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
      const res = await fetch(`${API_URL}/api/monster/${monsterId}/release`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`삭제 실패: ${res.status}`);
      alert("커켓몬이 방출되었습니다.");
    } catch (err) {
      alert("에러 발생: " + err.message);
    }
  };

  useEffect(() => {
    if (pageRef.current) pageRef.current.focus();
  }, []);

  return (
    <div className='myPage' ref={pageRef} tabIndex={0}>
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
        {loading ? <p>로딩 중...</p> : <p>{cukemonData?.name}</p>}
        <div id='relevanceCount'>
          <img src='/MyPage/relevance.webp' alt="친밀도 아이콘" />
          <span>{cukemonData?.affinity ?? "정보 없음"}</span>
        </div>
      </div>

      <div className="buttons">
        <button id="feedButton" onClick={handleFeedClick} />
        <button id="playButton" onClick={handlePlayClick} />
      </div>
      <span id="buttonText1">먹이주기</span>
      <span id="buttonText2">놀아주기</span>

      <img src='/MyPage/releaseButton.webp' id="releaseButton" onClick={releaseCukemon} />
      <MenuBar />
    </div>
  );
}

export default MyPage;
