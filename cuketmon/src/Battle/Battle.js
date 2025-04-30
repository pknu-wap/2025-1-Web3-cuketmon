import React, { useEffect, useState } from 'react';
import './Battle.css';

function Battle() {
  const [myCuketmonHP, setMyCuketmonHP] = useState(100);
  const [enemyCuketmonHP, setEnemyCuketmonHP] = useState(100);
  const [myPP, setMyPP] = useState(15);
  const [cuketmonImages, setCuketmonImages] = useState({
    myCuketmon: '/BattlePage/cuketmonEx.png',
    enemyCuketmon: '/BattlePage/cuketmonEx.png',
  });
  const [techs, setTechs] = useState([]);
  const [selectedTech, setSelectedTech] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMatched, setIsMatched] = useState(false);
  const [isFighting, setIsFighting] = useState(false);
  const [battleMessage, setBattleMessage] = useState('');
  const [currentAnimation, setCurrentAnimation] = useState(null);
  const [isPlayerHit, setIsPlayerHit] = useState(false);
  const [isEnemyHit, setIsEnemyHit] = useState(false);
  const [myTurn, setMyTurn] = useState(false);
  const [ws, setWs] = useState(null);

  const animationMap = {
    fire: {
      high: ['/BattlePage/animation/fire/highDamage1.png'],
      normal: ['/BattlePage/animation/fire/normalDamage1.png'],
    },
    water: {
      high: ['/BattlePage/animation/water/highDamage1.png'],
      normal: ['/BattlePage/animation/water/normalDamage1.png'],
    },
    normal: {
      high: ['/BattlePage/animation/normal/highDamage1.png'],
      normal: ['/BattlePage/animation/normal/normalDamage1.png'],
    },
    grass: {
      high: ['/BattlePage/animation/grass/highDamage1.png'],
      normal: ['/BattlePage/animation/grass/normalDamage1.png'],
    },
    electric: {
      high: ['/BattlePage/animation/electric/highDamage1.png'],
      normal: ['/BattlePage/animation/electric/normalDamage1.png'],
    },
    psychic: {
      high: ['/BattlePage/animation/psychic/highDamage1.png'],
      normal: ['/BattlePage/animation/psychic/normalDamage1.png'],
    },
    rock: {
      high: ['/BattlePage/animation/rock/highDamage1.png'],
      normal: ['/BattlePage/animation/rock/normalDamage1.png'],
    },
    iron: {
      high: ['/BattlePage/animation/iron/highDamage1.png'],
      normal: ['/BattlePage/animation/iron/normalDamage1.png'],
    },
    ice: {
      high: ['/BattlePage/animation/ice/highDamage1.png'],
      normal: ['/BattlePage/animation/ice/normalDamage1.png'],
    },
    dragon: {
      high: ['/BattlePage/animation/dragon/highDamage1.png'],
      normal: ['/BattlePage/animation/dragon/normalDamage1.png'],
    },
    evil: {
      high: ['/BattlePage/animation/evil/highDamage1.png'],
      normal: ['/BattlePage/animation/evil/normalDamage1.png'],
    },
    fairy: {
      high: ['/BattlePage/animation/fairy/highDamage1.png'],
      normal: ['/BattlePage/animation/fairy/normalDamage1.png'],
    },
    poison: {
      high: ['/BattlePage/animation/poison/highDamage1.png'],
      normal: ['/BattlePage/animation/poison/normalDamage1.png'],
    },
    bug: {
      high: ['/BattlePage/animation/bug/highDamage1.png'],
      normal: ['/BattlePage/animation/bug/normalDamage1.png'],
    },
    ground: {
      high: ['/BattlePage/animation/ground/highDamage1.png'],
      normal: ['/BattlePage/animation/ground/normalDamage1.png'],
    },
    fly: {
      high: ['/BattlePage/animation/fly/highDamage1.png'],
      normal: ['/BattlePage/animation/fly/normalDamage1.png'],
    },
    fighter: {
      high: ['/BattlePage/animation/fighter/highDamage1.png'],
      normal: ['/BattlePage/animation/fighter/normalDamage1.png'],
    },
    ghost: {
      high: ['/BattlePage/animation/ghost/highDamage1.png'],
      normal: ['/BattlePage/animation/ghost/normalDamage1.png'],
    },
  };

  useEffect(() => {
    const mockWebSocket = {
      send: (data) => console.log('Mock WebSocket send:', data),
      close: () => console.log('Mock WebSocket closed'),
    };
    setWs(mockWebSocket);

    setTimeout(() => {
      setLoading(false);
      setIsMatched(true);
      setMyTurn(true);
      setCuketmonImages({
        myCuketmon: '/BattlePage/cuketmonEx.png',
        enemyCuketmon: '/BattlePage/cuketmonEx.png',
      });
    }, 3000);

    return () => mockWebSocket.close();
  }, []);

  useEffect(() => {
    if (isMatched) {
      const mockData = [
        { id: 1, name: '잎날가르기', type: 'grass', damage: 10, description: '잎날가르기' },
        { id: 2, name: '불 퉤퉤', type: 'fire', damage: 80, description: '불퉤퉤' },
        { id: 3, name: '불 퉤에에에', type: 'fire', damage: 20, description: '불퉤퉤' },
        { id: 4, name: '새싹빔', type: 'grass', damage: 70, description: '새싹빔' },
      ];
      const updatedTechs = mockData.map((tech) => {
        const damageLevel = tech.damage >= 70 ? 'high' : 'normal';
        const animations = animationMap[tech.type][damageLevel];
        const randomIndex = Math.floor(Math.random() * animations.length);
        return { ...tech, animationUrl: animations[randomIndex] };
      });
      setTechs(updatedTechs);
    }
  }, [isMatched]);

  const handleSelect = (tech) => {
    if (myPP > 0 && myTurn) {
      setSelectedTech(tech.id);
    }
  };

  const handleFight = (tech) => {
    if (myPP > 0 && myTurn && ws) {
      setSelectedTech(tech.id);
      const damage = tech.damage;
      setMyPP((prev) => Math.max(prev - 1, 0));
      setBattleMessage(`커켓몬1이 ${tech.description}을 사용했다!`);
      setCurrentAnimation(tech.animationUrl);
      setIsFighting(true);

      setTimeout(() => {
        setIsFighting(false);
        setIsEnemyHit(true);
        setBattleMessage('');
        setSelectedTech(null);
        setCurrentAnimation(null);
        setMyTurn(false);
        setEnemyCuketmonHP((prev) => Math.max(prev - damage, 0));

        setTimeout(() => {
          setIsEnemyHit(false);
        }, 500);
      }, 1000);
    }
  };

  if (loading) {
    return (
      <div className="loadingScreen">
        <img src="/BattlePage/loadingcircle.png" className="loadingSpinner" alt="로딩 중" />
        <p>매칭 중...</p>
      </div>
    );
  }

  return (
    <div className="Battle">
      <div className="content">
        <div className="battleContainer">
          <div className="mySection">
            <div className="hpBackground">
              <img src="/BattlePage/hpBg.png" className="myHpBackground" alt="체력바배경" />
              <img src="/BattlePage/hpBar.png" className="myHpImage" alt="체력바" />
              <div className="myHpBar">
              <div className="myHpFill" style={{ width: `${myCuketmonHP}%` }}></div>
            </div>
            </div>
            
            <div className="cuketmon">
              <img
                src={cuketmonImages.myCuketmon}
                className={`myCuketmonImage ${isPlayerHit ? 'hitEffect' : ''}`}
                alt="내 커켓몬"
              />
              <img src="/BattlePage/stand.png" className="myStage" alt="전투무대" />
            </div>
          </div>

          <div className="enemySection">
            <div className="hpBackground">
              <img src="/BattlePage/hpBg.png" className="enemyHpBackground" alt="체력바배경" />
              <img src="/BattlePage/hpBar.png" className="enemyHpImage" alt="체력바" />
              <div className="enemyHpBar">
              <div className="enemyHpFill" style={{ width: `${enemyCuketmonHP}%` }}>
              
              </div>
            </div>
            </div>
            
            <div className="cuketmon">
              <img
                src={cuketmonImages.enemyCuketmon}
                className={`enemyCuketmonImage ${isEnemyHit ? 'hitEffect' : ''}`}
                alt="적 커켓몬"
              />
              <img src="/BattlePage/stand.png" className="enemyStage" alt="전투무대" />
            </div>
          </div>
        </div>

        <div className="techSection">
          {!isFighting && (
            <div className="techButtons">
              {techs.map((tech) => (
                <button
                  key={tech.id}
                  className={`techButton ${selectedTech === tech.id ? 'selected' : ''}`}
                  onClick={() => handleSelect(tech)}
                  onDoubleClick={() => handleFight(tech)}
                  disabled={myPP <= 0 || !myTurn}
                >
                  {tech.name}
                </button>
              ))}
            </div>
          )}
          {isFighting && (
            <div className="battleAnimationOverlay">
              <img
                src={currentAnimation}
                className="techAnimation"
                alt="기술 애니메이션"
              />
              <div className="battleMessage">{battleMessage}</div>
            </div>
          )}
          <span className="ppInfo">PP {myPP}/15</span>
          <span className="cuketmonType">
            TYPE/{techs.length > 0 ? techs[0].type : '없음'}
          </span>
          <span className="turnInfo">{myTurn ? '내 턴' : '상대 턴'}</span>
        </div>
      </div>
    </div>
  );
}

export default Battle;