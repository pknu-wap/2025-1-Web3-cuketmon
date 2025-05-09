import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import './Battle.css';

function Battle() {
  const [myCuketmonHP, setMyCuketmonHP] = useState(100);
  const [enemyCuketmonHP, setEnemyCuketmonHP] = useState(100);
  const [myPP, setMyPP] = useState(15);
  const [cuketmonImages, setCuketmonImages] = useState({
    myCuketmon: '',
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
  const [battleId, setBattleId] = useState('');
  const [winner, setWinner] = useState(null);
  const [trainerName, setTrainerName] = useState('');
  const [isBattleEnded, setIsBattleEnded] = useState(false);
  const stompClientRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = process.env.REACT_APP_API_URL;

  const { selectedCuketmon , monsterId} = location.state || {}; 

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
    const hue = hp * 1.2;
    return `hsl(${hue}, 100%, 50%)`;
  };

  const handleSelect = (tech) => {
    if (myPP > 0 && myTurn) {
      setSelectedTech(tech.id);
    }
  };

  const handleFight = (tech) => {
    if (myPP > 0 && myTurn && stompClientRef.current && stompClientRef.current.connected) {
      setSelectedTech(tech.id);
      setCurrentAnimation(tech.animationUrl);
      setIsFighting(true);
      setTimeout(() => {
        setIsFighting(false);
        setSelectedTech(null);
        setCurrentAnimation(null);
      }, 1000);
    }
  };

  // trainerName을 /trainer/myName에서 가져오기
  useEffect(() => {
    const fetchTrainerName = async () => {
      try {
        const token = localStorage.getItem('jwt'); // 토큰을 localStorage에서 가져옴
        if (!token) {
          console.error('No token available');
          return;
        }
        const res = await fetch(`${API_URL}/api/trainer/myName`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const trainerName = await res.text();
        setTrainerName(trainerName); 
      } catch (error) {
        console.error('Failed to fetch trainer name:', error.message);
      }
    };

    fetchTrainerName();
  }, [API_URL]);

  // 커켓몬 선택 기억
  useEffect(() => {
    if (selectedCuketmon) {
      setCuketmonImages((prev) => ({
        ...prev,
        myCuketmon: selectedCuketmon.image,
      }));
    } else {
      console.log('Error: No selected Cuketmon');
    }
  }, [selectedCuketmon, navigate]);

  // WebSocket 연결 설정 및 배틀 찾기 요청
  useEffect(() => {
    const socket = new SockJS(`${API_URL}/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('Connected to WebSocket');
        stompClientRef.current = client;

        // 매칭 알림 구독
        client.subscribe('/topic/match/*', (message) => {
          const matchResponse = JSON.parse(message.body);
          console.log('Match response received:', matchResponse);
          setBattleId(matchResponse.battleId);
          setTrainerName(matchResponse.trainerName || trainerName);
          setCuketmonImages({
            myCuketmon: matchResponse.myCuketmon.image || selectedCuketmon.image,
            enemyCuketmon: matchResponse.enemyCuketmon.image,
          });
          setMyCuketmonHP(matchResponse.myCuketmon.hp);
          setEnemyCuketmonHP(matchResponse.enemyCuketmon.hp);
          setMyPP(matchResponse.myCuketmon.pp);
          setTechs(
            matchResponse.myCuketmon.skills.map((skill) => ({
              id: skill.id,
              name: skill.name,
              type: skill.type,
              damage: skill.power,
              description: skill.name,
              animationUrl: animationMap[skill.type][skill.power >= 70 ? 'high' : 'normal'][0],
            }))
          );
          setLoading(false);
          setIsMatched(true);
          setMyTurn(matchResponse.isMyTurn);
        });

        
        if (trainerName && monsterId && stompClientRef.current && stompClientRef.current.connected) {
          client.publish({
            destination: '/app/findBattle',
            body: JSON.stringify({ trainerName, monsterId }),
          });
          console.log('Battle find request sent:', { trainerName, monsterId });
        } else {
          console.error('Cannot send findBattle request: Missing trainerName or monsterId');
        }
      },
      onStompError: (frame) => {
        console.error('STOMP connection error:', frame);
        setLoading(false);
      },
    });
    client.activate();

    return () => {
      client.deactivate();
    };
  }, [selectedCuketmon, trainerName, API_URL]);

  if (loading) {
    return (
      <div className="loadingScreen">
        <img src="/BattlePage/loadingcircle.png" className="loadingSpinner" alt="Loading" />
        <p>Matching...</p>
      </div>
    );
  }

  if (isBattleEnded) {
    const winnerImage = winner === 'player' ? cuketmonImages.myCuketmon : cuketmonImages.enemyCuketmon;
    return (
      <div className="resultScreen">
        <h1>{winner === 'player' ? 'Victory!' : 'Defeat...'}</h1>
        <img src={winnerImage} className="winnerCuketmonImage" alt="Winner" />
        <button className="endBattle" onClick={() => navigate('/mypage')}>End Battle</button>
      </div>
    );
  }

  return (
    <div className="Battle">
      <div className="content">
        <div className="battleContainer">
          <div className="mySection">
            <div className="hpBackground">
              <p>{selectedCuketmon.name}</p>
              <img src="/BattlePage/hpBar.png" className="myHpImage" alt="HP Bar" />
              <div className="myHpBar">
                <div
                  className="myHpFill"
                  style={{ width: `${myCuketmonHP}%`, backgroundColor: getHpColor(myCuketmonHP) }}
                ></div>
              </div>
            </div>
            <div className="cuketmon">
              <img
                src={cuketmonImages.myCuketmon}
                className={`myCuketmonImage ${isPlayerHit ? 'hitEffect' : ''}`}
                alt="My Cuketmon"
              />
              <img src="/BattlePage/stand.png" className="myStage" alt="Stage" />
            </div>
          </div>
          <div className="enemySection">
            <div className="hpBackground">
              <p>Enemy Cuketmon</p>
              <img src="/BattlePage/hpBar.png" className="enemyHpImage" alt="HP Bar" />
              <div className="enemyHpBar">
                <div
                  className="enemyHpFill"
                  style={{ width: `${enemyCuketmonHP}%`, backgroundColor: getHpColor(enemyCuketmonHP) }}
                ></div>
              </div>
            </div>
            <div className="cuketmon">
              <img
                src={cuketmonImages.enemyCuketmon}
                className={`enemyCuketmonImage ${isEnemyHit ? 'hitEffect' : ''}`}
                alt="Enemy Cuketmon"
              />
              <img src="/BattlePage/stand.png" className="enemyStage" alt="Stage" />
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
                  disabled={myPP <= 0 || !myTurn}
                >
                  {tech.name}
                </button>
              ))}
            </div>
          )}
          {isFighting && (
            <div className="battleAnimationOverlay">
              <img src={currentAnimation} className="techAnimation" alt="Tech Animation" />
              <div className="battleMessage">{battleMessage}</div>
            </div>
          )}
          <span className="ppInfo">PP {myPP}/15</span>
          <span className="cuketmonType">TYPE/{techs.length > 0 ? techs[0].type : 'None'}</span>
          <span className="turnInfo">{myTurn ? 'My Turn' : 'Enemy Turn'}</span>
        </div>
      </div>
    </div>
  );
}

export default Battle;