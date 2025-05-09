import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import './Battle.css';

function Battle() {
  const [blueCuketmonHP, setBlueCuketmonHP] = useState(100);
  const [redCuketmonHP, setRedCuketmonHP] = useState(100);
  const [techs, setTechs] = useState([]); // 기술별 PP 포함
  const [selectedTech, setSelectedTech] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMatched, setIsMatched] = useState(false);
  const [isFighting, setIsFighting] = useState(false);
  const [battleMessage, setBattleMessage] = useState('');
  const [currentAnimation, setCurrentAnimation] = useState(null);
  const [isBlueHit, setIsBlueHit] = useState(false);
  const [isRedHit, setIsRedHit] = useState(false);
  const [myTurn, setMyTurn] = useState(false);
  const [battleId, setBattleId] = useState('');
  const [winner, setWinner] = useState(null);
  const [trainerName, setTrainerName] = useState('');
  const [isBattleEnded, setIsBattleEnded] = useState(false);
  const [myTeam, setMyTeam] = useState(null);
  const [blueTeam, setBlueTeam] = useState(null);
  const [redTeam, setRedTeam] = useState(null);
  const [error, setError] = useState(null); // 에러 상태 추가
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
    if (tech.pp > 0 && myTurn) {
      setSelectedTech(tech.id);
    }
  };

  const handleFight = (tech) => {
    if (tech.pp > 0 && myTurn && stompClientRef.current && stompClientRef.current.connected) {
      setSelectedTech(tech.id);
      setCurrentAnimation(tech.animationUrl);
      setIsFighting(true);
      setTechs((prevTechs) =>
        prevTechs.map((t) =>
          t.id === tech.id ? { ...t, pp: t.pp - 1 } : t
        )
      ); // PP 감소
      setTimeout(() => {
        setIsFighting(false);
        setSelectedTech(null);
        setCurrentAnimation(null);
      }, 1000);
    }
  };

  useEffect(() => {
    const fetchTrainerName = async () => {
      try {
        const token = localStorage.getItem('jwt');
        if (!token) throw new Error('No token available');
        const res = await fetch(`${API_URL}/api/trainer/myName`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const trainerName = await res.text();
        setTrainerName(trainerName);
      } catch (error) {
        console.error('Failed to fetch trainer name:', error.message);
        setError('트레이너 이름을 가져오지 못했습니다.');
      }
    };

    fetchTrainerName();
  }, [API_URL]);

  useEffect(() => {
    const socket = new SockJS(`${API_URL}/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('Connected to WebSocket');
        stompClientRef.current = client;

        client.subscribe('/topic/match/*', (message) => {
          const matchResponse = JSON.parse(message.body);
          console.log('Match response received:', matchResponse);

          setBattleId(matchResponse.battleId);
          setBlueTeam(matchResponse.blue || { trainerName: 'Unknown', monster: { hp: 100, image: '/default.png', skills: [] } });
          setRedTeam(matchResponse.red || { trainerName: 'Unknown', monster: { hp: 100, image: '/default.png', skills: [] } });

          const isBlueTeam = matchResponse.blue?.trainerName === trainerName;
          setMyTeam(isBlueTeam ? 'blue' : 'red');

          const myTeamData = isBlueTeam ? matchResponse.blue : matchResponse.red;
          const enemyTeamData = isBlueTeam ? matchResponse.red : matchResponse.blue;

          setBlueCuketmonHP(matchResponse.blue?.monster.hp || 100);
          setRedCuketmonHP(matchResponse.red?.monster.hp || 100);
          setTechs(
            (myTeamData?.monster.skills || []).map((skill) => ({
              id: skill.id,
              name: skill.name,
              type: skill.type,
              damage: skill.power,
              pp: skill.pp || 15, // 기술별 PP 설정
              description: skill.name,
              animationUrl: animationMap[skill.type.toLowerCase()]?.[skill.power >= 70 ? 'high' : 'normal']?.[0],
            }))
          );
          setMyTurn(myTeamData?.turn || false);
          setLoading(false);
          setIsMatched(true);
        });


        if (trainerName && monsterId && stompClientRef.current && stompClientRef.current.connected){
          client.publish({
            destination: '/app/findBattle',
            body: JSON.stringify({ trainerName, monsterId }),
          });
          console.log('Battle find request sent:', { trainerName, monsterId });
        }
      },
      onStompError: (frame) => {
        console.error('STOMP connection error:', frame);
        setLoading(false);
        setError('WebSocket 연결에 실패했습니다.');
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

  if (error) {
    return (
      <div className="errorScreen">
        <p>{error}</p>
        <button onClick={() => navigate('/mypage')}>돌아가기</button>
      </div>
    );
  }

  if (isBattleEnded) {
    const winnerImage = winner === 'player' ? (myTeam === 'blue' ? blueTeam.monster.image : redTeam.monster.image) : (myTeam === 'blue' ? redTeam.monster.image : blueTeam.monster.image);
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
          {blueTeam && (
            <div className="blueTeamSection">
              <div className="hpBackground">
                <p>{blueTeam.trainerName}</p>
                <img src="/BattlePage/hpBar.png" className={myTeam === 'blue' ? 'myHpImage' : 'enemyHpImage'} alt="HP Bar" />
                <div className={myTeam === 'blue' ? 'myHpBar' : 'enemyHpBar'}>
                  <div
                    className={myTeam === 'blue' ? 'myHpFill' : 'enemyHpFill'}
                    style={{ width: `${blueCuketmonHP}%`, backgroundColor: getHpColor(blueCuketmonHP) }}
                  ></div>
                </div>
              </div>
              <div className="cuketmon">
                <img
                  src={blueTeam.monster.image}
                  className={myTeam === 'blue' ? `myCuketmonImage ${isBlueHit ? 'hitEffect' : ''}` : `enemyCuketmonImage ${isBlueHit ? 'hitEffect' : ''}`}
                  alt="Blue Team Cuketmon"
                />
                <img src="/BattlePage/stand.png" className={myTeam === 'blue' ? 'myStage' : 'enemyStage'} alt="Stage" />
              </div>
            </div>
          )}
          {redTeam && (
            <div className="redTeamSection">
              <div className="hpBackground">
                <p>{redTeam.trainerName}</p>
                <img src="/BattlePage/hpBar.png" className={myTeam === 'red' ? 'myHpImage' : 'enemyHpImage'} alt="HP Bar" />
                <div className={myTeam === 'red' ? 'myHpBar' : 'enemyHpBar'}>
                  <div
                    className={myTeam === 'red' ? 'myHpFill' : 'enemyHpFill'}
                    style={{ width: `${redCuketmonHP}%`, backgroundColor: getHpColor(redCuketmonHP) }}
                  ></div>
                </div>
              </div>
              <div className="cuketmon">
                <img
                  src={redTeam.monster.image}
                  className={myTeam === 'red' ? `myCuketmonImage ${isRedHit ? 'hitEffect' : ''}` : `enemyCuketmonImage ${isRedHit ? 'hitEffect' : ''}`}
                  alt="Red Team Cuketmon"
                />
                <img src="/BattlePage/stand.png" className={myTeam === 'red' ? 'myStage' : 'enemyStage'} alt="Stage" />
              </div>
            </div>
          )}
        </div>
        <div className="techSection">
          {!isFighting && (
            <div className="techButtons">
              {techs.map((tech) => (
                <button
                  key={tech.id}
                  className={`techButton ${selectedTech === tech.id ? 'selected' : ''}`}
                  onClick={() => handleSelect(tech)}
                  disabled={tech.pp <= 0 || !myTurn}
                >
                  {tech.name} (PP: {tech.pp})
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
          <span className="turnInfo">{myTurn ? 'My Turn' : 'Enemy Turn'}</span>
        </div>
      </div>
    </div>
  );
}

export default Battle;