import React, {  useRef, useEffect, useState } from 'react';
import MenuBar from "../Menubar/Menubar.js";
import './MyPage.css';
import { useAuth } from '../AuthContext';

function MyPage() {
  const [toyCount, setToyCount] = useState();
  const [feedCount, setFeedCount] = useState();
  const [loading, setLoading] = useState(true);
  const [cukemonData, setCukemonData] = useState(null);
  const [monsterId, setMonsterId] = useState(null);
  const [monsters, setMonsters] = useState([]); 
  const API_URL = process.env.REACT_APP_API_URL;
  const { token: contextToken } = useAuth();
  const token = contextToken || localStorage.getItem('accessToken');
  const isLoadingRef = useRef(false);


  /*유저 소유 커켓몬 조회하기 */
  const loadCukemon = async () => {
    try {
      const res = await fetch(`${API_URL}/api/trainer/monsters`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      const monsterIds = Array.isArray(data) ? data : [];  
      setMonsters(monsterIds);     
    } catch (error) {
      console.error("커켓몬 로딩에 실패했습니다.", error.message);
    }
  };
  useEffect(() => {
    loadCukemon(); 
  }, []);

  useEffect(() => {
    if (monsters.length > 0 && monsterId === null) {
      setMonsterId(0);
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
    if (monsterId == null  || monsters.length === 0) return;
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
    if (monsterId == null  || monsters.length === 0) return;
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

/*방출*/
const releaseCukemon = async () => {
  if (monsterId == null || monsters.length === 0) return;
  const confirmRelease = window.confirm("해당 커켓몬을 정말로 놓아주실건가요?");
  if (!confirmRelease) return;
  try {
    const currentMonsterId = monsters[monsterId];
    const res = await fetch(`${API_URL}/api/monster/${currentMonsterId}/release`, {
      method: "DELETE",
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`삭제 실패: ${res.status}`);
    alert("커켓몬이 원래 있던 곳으로 돌아갔습니다.");
    loadCukemon();
  } catch (err) {
    alert("에러 발생: " + err.message);
  }
};

/*desktop-커켓몬 조회 */
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


  /*모바일- 스와이프로 마이페이지 커켓몬 조회(5/8) */
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;
  
    const handleTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX;
    };
  
    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipeGesture();
    };
  
    const handleSwipeGesture = () => {
      const swipeThreshold = 30; 
      if (touchEndX < touchStartX - swipeThreshold) {
        setMonsterId((prevIndex) =>
          prevIndex < monsters.length - 1 ? prevIndex + 1 : 0
        );
      }
      if (touchEndX > touchStartX + swipeThreshold) {
        setMonsterId((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : monsters.length - 1
        );
      }
    };
  
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
  
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [monsters]);
  



  return (
    <div className='myPage'>
      <div className='buttons'>

          <div className='feedCukemonButton' onClick={feedCukemon}>
            <img src='/MyPage/feed.webp' id='feed' alt="밥 아이콘" />
            <span>{feedCount}</span>
          </div>

            <div className='playCukemonButton'onClick={playCukemon}>
            <img src='/MyPage/toy.webp' id='play'alt="장난감 아이콘" />
            <span>{toyCount}</span>
            </div>
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
      


      <img src='/MyPage/releaseButton.webp' id="releaseButton" onClick={releaseCukemon} />
            <MenuBar centered={true}/>
    </div>
  );
}

export default MyPage;