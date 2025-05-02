import React, { useEffect, useState } from 'react';
import './Battle.css';
import { useNavigate } from 'react-router-dom';

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
  const [isBattleEnded, setIsBattleEnded] = useState(false);
  const [winner, setWinner] = useState(null);
  const navigate = useNavigate();

  const animationMap = {
    fire: {
      high: ['/BattlePage/Animation/Fire/highDamage1.png'],
      normal: ['/BattlePage/Animation/Fire/normalDamage1.png'],
    },
    water: {
      high: ['/BattlePage/Animation/Water/highDamage1.png'],
      normal: ['/BattlePage/Animation/Water/normalDamage1.png'],
    },
    normal: {
      high: ['/BattlePage/Animation/Normal/highDamage1.png'],
      normal: ['/BattlePage/Animation/Normal/normalDamage1.png'],
    },
    grass: {
      high: ['/BattlePage/Animation/Grass/highDamage1.png'],
      normal: ['/BattlePage/Animation/Grass/normalDamage1.png'],
    },
    electric: {
      high: ['/BattlePage/Animation/Electric/highDamage1.png'],
      normal: ['/BattlePage/Animation/Electric/normalDamage1.png'],
    },
    psychic: {
      high: ['/BattlePage/Animation/Psychic/highDamage1.png'],
      normal: ['/BattlePage/Animation/Psychic/normalDamage1.png'],
    },
    rock: {
      high: ['/BattlePage/Animation/Rock/highDamage1.png'],
      normal: ['/BattlePage/Animation/Rock/normalDamage1.png'],
    },
    iron: {
      high: ['/BattlePage/Animation/Iron/highDamage1.png'],
      normal: ['/BattlePage/Animation/Iron/normalDamage1.png'],
    },
    ice: {
      high: ['/BattlePage/Animation/Ice/highDamage1.png'],
      normal: ['/BattlePage/Animation/Ice/normalDamage1.png'],
    },
    dragon: {
      high: ['/BattlePage/Animation/Dragon/highDamage1.png'],
      normal: ['/BattlePage/Animation/Dragon/normalDamage1.png'],
    },
    evil: {
      high: ['/BattlePage/Animation/Evil/highDamage1.png'],
      normal: ['/BattlePage/Animation/Evil/normalDamage1.png'],
    },
    fairy: {
      high: ['/BattlePage/Animation/Fairy/highDamage1.png'],
      normal: ['/BattlePage/Animation/Fairy/normalDamage1.png'],
    },
    poison: {
      high: ['/BattlePage/Animation/Poison/highDamage1.png'],
      normal: ['/BattlePage/Animation/Poison/normalDamage1.png'],
    },
    bug: {
      high: ['/BattlePage/Animation/Bug/highDamage1.png'],
      normal: ['/BattlePage/Animation/Bug/normalDamage1.png'],
    },
    ground: {
      high: ['/BattlePage/Animation/Ground/highDamage1.png'],
      normal: ['/BattlePage/Animation/Ground/normalDamage1.png'],
    },
    fly: {
      high: ['/BattlePage/Animation/Fly/highDamage1.png'],
      normal: ['/BattlePage/Animation/Fly/normalDamage1.png'],
    },
    fighter: {
      high: ['/BattlePage/Animation/Fighter/highDamage1.png'],
      normal: ['/BattlePage/Animation/Fighter/normalDamage1.png'],
    },
    ghost: {
      high: ['/BattlePage/Animation/Ghost/highDamage1.png'],
      normal: ['/BattlePage/Animation/Ghost/normalDamage1.png'],
    },
  };

  const getHpColor = (hp) => {
    const hue = hp * 1.2; // 120 (초록)에서 0 (빨강)으로 점진적 변화
    return `hsl(${hue}, 100%, 50%)`;
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
        /*setMyTurn(false);*/
        const newEnemyHP = Math.max(enemyCuketmonHP - damage, 0);
        setEnemyCuketmonHP(newEnemyHP);

        if (newEnemyHP <= 0) {
          setIsBattleEnded(true);
          setWinner('player');
        }

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
  
  if (isBattleEnded) {
      const winnerImage = winner === 'player' ? cuketmonImages.myCuketmon : cuketmonImages.enemyCuketmon;
      return (
        <div className="resultScreen">
          <h1>{winner === 'player' ? '승리!' : '패배...'}</h1>
          <img
            src={winnerImage}
            className="winnerCuketmonImage"
            alt="승리자"
          />
        <button className="endBattle" onClick={() => navigate('/mypage')}>전투종료</button>
      </div>
    );
  }

  return (
    <div className="Battle">
      <div className="content">
        <div className="battleContainer">
          <div className="mySection">
            <div className="hpBackground">
              <p>커켓몬1</p>
              <img src="/BattlePage/hpBar.png" className="myHpImage" alt="체력바" />
              <div className="myHpBar">
              <div className="myHpFill" style={{ width: `${myCuketmonHP}%`, backgroundColor: getHpColor(myCuketmonHP) }}></div>
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
              <p>커켓몬2</p>
              <img src="/BattlePage/hpBar.png" className="enemyHpImage" alt="체력바" />
              <div className="enemyHpBar">
              <div className="enemyHpFill" style={{ width: `${enemyCuketmonHP}%`, backgroundColor: getHpColor(enemyCuketmonHP) }}></div>
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