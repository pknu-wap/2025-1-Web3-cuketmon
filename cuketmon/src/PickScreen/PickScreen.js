import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './PickScreen.css';

const PickScreen = () => {
  const [cuketmons, setCuketmons] = useState([]);
  const [monsterIdList, setMonsterIdList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [monsterId, setMonsterId] = useState([]);
  const navigate = useNavigate();
  const { token: contextToken } = useAuth();
  const token = contextToken || localStorage.getItem('jwt');
  const API_URL = process.env.REACT_APP_API_URL;

  // 유저 소유 커켓몬 ID 목록 조회
  const loadCukemonIds = async () => {
    if (!token) {
      console.error('토큰이 없습니다.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/trainer/monsters`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      const ids = Array.isArray(data) ? data : [];
      setMonsterIdList(ids);
      if (ids.length === 0) {
        console.warn('커켓몬 ID 목록이 비어 있습니다.');
      }
    } catch (error) {
      console.error('커켓몬 ID 로딩에 실패했습니다:', error.message);
      if (error.message.includes('401')) {
        navigate('/login');
      }
    }
  };

  // 커켓몬 전투 정보 조회
  const loadCukemonData = async (monsterId) => {
    if (!monsterId) return null;
    try {
      const res = await fetch(`${API_URL}/api/monster/${monsterId}/battleInfo`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      return {
        id: data?.id || null,
        name: data?.name || '이름 없음',
        image: data?.image || '',
        type1: data?.type1 || null,
        type2: data?.type2 || null,
      };
    } catch (error) {
      console.error(`커켓몬 ${monsterId} 데이터 로딩 실패:`, error.message);
      return null;
    }
  };

  // 커켓몬 데이터 초기화
  useEffect(() => {
    const fetchCuketmons = async () => {
      await loadCukemonIds();
      if (monsterIdList.length > 0) {
        const cuketmonData = [];
        for (const id of monsterIdList) {
          const data = await loadCukemonData(id);
          if (data) {
            cuketmonData.push(data);
          }
        }
        setCuketmons(cuketmonData);
      }
      setLoading(false);
    };

    fetchCuketmons();

    const retryTimeout = setTimeout(() => {
      if (!cuketmons || cuketmons.length === 0) {
        fetchCuketmons();
      }
    }, 500);

    return () => clearTimeout(retryTimeout);
  }, [monsterIdList.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? cuketmons.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === cuketmons.length - 1 ? 0 : prev + 1));
  };

  const handleSelect = (cuketmon) => {
    if (cuketmon) {
      localStorage.setItem('monsterId', monsterIdList[currentIndex]);
      navigate('/battle', { state: { monsterId: monsterIdList[currentIndex] } });
    } else {
      console.error('선택된 커켓몬이 없습니다.');
    }
  };

  if (loading) {
    return <div className="pickScreenLoading">로딩 중...</div>;
  }

  if (cuketmons.length === 0) {
    return <div className="pickScreen NoData">보유한 커켓몬이 없습니다.</div>;
  }

  const currentCuketmon = cuketmons[currentIndex];

  return (
    <div className="pickScreen">
      <h1 className="pickTitle">커켓몬 선택</h1>
      <div className="pickContent">
        <button onClick={handlePrev} className="arrowButton arrowLeft" disabled={cuketmons.length <= 1}>
          ◀
        </button>
        <div className="cuketmonCard">
          <img
            src={currentCuketmon.image}
            alt={currentCuketmon.name}
            className="cuketmonImage"
          />
          <p className="cuketmonName">{currentCuketmon.name}</p>
          <p className="cuketmonType">
            타입: {currentCuketmon.type1}
            / {currentCuketmon.type2 || '없음'}
          </p>
          <button
            onClick={() => handleSelect(currentCuketmon)}
            className="selectButton"
            disabled={!currentCuketmon}
          >
            선택
          </button>
        </div>
        <button onClick={handleNext} className="arrowButton arrowRight" disabled={cuketmons.length <= 1}>
          ▶
        </button>
      </div>
    </div>
  );
};

export default PickScreen;