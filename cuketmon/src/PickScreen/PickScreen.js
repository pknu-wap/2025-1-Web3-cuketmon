import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PickScreen.css';

const PickScreen = () => {
  const [cuketmons, setCuketmons] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCuketmons = async () => {
      try {
        const response = await fetch('');
        const data = await response.json();
        const mockCuketmons = data.slice(0, 3).map((item, index) => ({
          id: item.id,
          name: `커켓몬${index + 1}`,
          image: `https://via.placeholder.com/150?text=커켓몬${index + 1}`,
        }));
        setCuketmons(mockCuketmons);
      } catch (error) {
        console.error('커켓몬 데이터를 가져오는 데 실패했습니다:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCuketmons();
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? cuketmons.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === cuketmons.length - 1 ? 0 : prev + 1));
  };

  const handleSelect = (cuketmon) => {
    navigate(`/battle`, { state: { selectedCuketmon: cuketmon } });
  };

  if (loading) {
    return <div className="pick-screen loading">로딩 중...</div>;
  }

  if (cuketmons.length === 0) {
    return <div className="pick-screen no-data">보유한 커켓몬이 없습니다.</div>;
  }

  const currentCuketmon = cuketmons[currentIndex];

  return (
    <div className="pick-screen">
      <h1 className="pick-title">커켓몬 선택</h1>
      <div className="pick-content">
        <button onClick={handlePrev} className="arrow-button arrow-left">
          ◀
        </button>
        <div className="cuketmon-card">
          <img
            src={currentCuketmon.image}
            alt={currentCuketmon.name}
            className="cuketmon-image"
          />
          <p className="cuketmon-name">{currentCuketmon.name}</p>
          <button
            onClick={() => handleSelect(currentCuketmon)}
            className="select-button"
          >
            선택
          </button>
        </div>
        <button onClick={handleNext} className="arrow-button arrow-right">
          ▶
        </button>
      </div>
    </div>
  );
};

export default PickScreen;