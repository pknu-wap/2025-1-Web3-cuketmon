import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './PickScreen.css';
import typeData from '../Type.js';

const PickScreen = () => {
  const [cuketmons, setCuketmons] = useState([]);
  const [monsterIdList, setMonsterIdList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { token: contextToken } = useAuth();
  const token = contextToken || localStorage.getItem('accessToken');
  const API_URL = process.env.REACT_APP_API_URL;

  // 유저 커켓몬 ID 불러오기
  const loadCukemonIds = async () => {
    try {
      const res = await fetch(`${API_URL}/api/trainer/monsters`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ids = await res.json();
      setMonsterIdList(Array.isArray(ids) ? ids : []);
    } catch (error) {
      console.error('ID 로딩 실패:', error);
      if (error.message.includes('401')) navigate('/login');
    }
  };

  // 커켓몬 상세 정보 불러오기
  const loadCukemonData = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/monster/${id}/battleInfo`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return await res.json();
    } catch (error) {
      console.error(`데이터 로딩 실패: ${id}`, error);
      return null;
    }
  };

  // 전체 로딩
  useEffect(() => {
    const fetchAll = async () => {
      await loadCukemonIds();
    };
    fetchAll();
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      const dataList = await Promise.all(monsterIdList.map(id => loadCukemonData(id)));
      setCuketmons(dataList.filter(Boolean));
      setLoading(false);
    };
    if (monsterIdList.length > 0) fetchDetails();
  }, [monsterIdList]);

  if (loading) return <div className="pickScreenLoading">로딩 중...</div>;
  if (cuketmons.length === 0) return <div className="pickScreenNoData">보유한 커켓몬이 없습니다.</div>;

  const current = cuketmons[currentIndex];
  const type1Color = typeData[current.type1]?.color || 'gray';
  const type2Color = current.type2 ? (typeData[current.type2]?.color || 'gray') : 'gray';

  return (
    <div className="aspectWrapper">
      <div className="pickScreen">
        <h1 className="pickTitle">커켓몬 선택</h1>
        <div className="pickContent">
          <button onClick={() => setCurrentIndex((prev) => (prev === 0 ? cuketmons.length - 1 : prev - 1))} className="arrowButton" disabled={cuketmons.length <= 1}>
            <img src="/PickScreen/arrowLeft.webp" alt="←" />
          </button>

          <div className="cuketmonCard">
            <img src={current.image} alt={current.name} className="cuketmonImage" />
            <div className="HPbarContainer commonImageContainer">
              <img src="/PickScreen/HPBar.webp" alt="HP Bar" />
              <div className="overlayText nameText">{current.name}</div>
              <div className="overlayText hpText">{current.hp}/{current.hp}</div>
              <div className="typeText">
                <span style={{ color: type1Color }}>{current.type1}</span>
                {current.type2 && <> | <span style={{ color: type2Color }}>{current.type2}</span></>}
              </div>
            </div>

            <div className="specContainer commonImageContainer">
              <img src="/PickScreen/spec.webp" alt="스탯" />
              <div className="overlayText specText">
                <div className="specRow"><span>{current.attack}</span><span>{current.specialAttack}</span></div>
                <div className="specRow"><span>{current.defence}</span><span>{current.specialDefence}</span></div>
                <div className="specRow"><span>{current.speed}</span></div>
              </div>
            </div>
          </div>

          <button onClick={() => setCurrentIndex((prev) => (prev === cuketmons.length - 1 ? 0 : prev + 1))} className="arrowButton" disabled={cuketmons.length <= 1}>
            <img src="/PickScreen/arrowRight.webp" alt="→" />
          </button>
        </div>

        <div className="buttonContainer">
          <button onClick={() => navigate('/mypage')} className="buttonSet"><img src="/PickScreen/backButton.webp" alt="뒤로" /></button>
          <button onClick={() => {
            localStorage.setItem('monsterId', monsterIdList[currentIndex]);
            navigate('/battle', { state: { monsterId: monsterIdList[currentIndex] } });
          }} className="buttonSet"><img src="/PickScreen/selectButton.webp" alt="선택" /></button>
        </div>
      </div>
    </div>
  );
};

export default PickScreen;
