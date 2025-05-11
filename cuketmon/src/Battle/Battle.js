import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import './Battle.css';

function Battle() {
  const [blueCuketmonHP, setBlueCuketmonHP] = useState(100);
  const [redCuketmonHP, setRedCuketmonHP] = useState(100);
  const [techs, setTechs] = useState([]);
  const [selectedTech, setSelectedTech] = useState(null);
  const [selectedTechType, setSelectedTechType] = useState('');
  const [loading, setLoading] = useState(true);
  const [isMatched, setIsMatched] = useState(false);
  const [isFighting, setIsFighting] = useState(false);
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
  const [error, setError] = useState(null);
  const [currentPp, setCurrentPp] = useState(100);
  const [maxPp, setMaxPp] = useState(100);
  const [animationDirection, setAnimationDirection] = useState('');
  const stompClientRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = process.env.REACT_APP_API_URL;

  const { monsterId } = location.state || {};

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
    const hue = Math.max(0, Math.min(120, hp * 1.2));
    return `hsl(${hue}, 100%, 50%)`;
  };

  const handleSelect = (tech, index) => {
    if (currentPp >= (tech.ppCost || 0) && myTurn && !isFighting) {
      setSelectedTech(index);
      setSelectedTechType(tech.type);
    }
  };

  const handleFight = (tech, index) => {
    if (
      index < 0 ||
      index > 3 ||
      !tech ||
      currentPp < (tech.ppCost || 0) ||
      !myTurn ||
      isFighting ||
      !stompClientRef.current?.connected ||
      !battleId
    ) {
      console.warn('error:', { index, currentPp, myTurn, isFighting, connected: stompClientRef.current?.connected, battleId });
      return;
    }

    const ppCost = tech.ppCost || 20;
    const animationUrl = tech.animationUrl;

    setSelectedTech(index);
    setCurrentAnimation(animationUrl);
    setAnimationDirection(myTeam === 'blue' ? 'blue-to-red' : 'red-to-blue');
    setIsFighting(true);
    setIsBlueHit(myTeam === 'red');
    setIsRedHit(myTeam === 'blue');

    stompClientRef.current.publish({
      destination: '/app/findBattle',
      body: JSON.stringify({
        skillId: index,
        trainerName: trainerName,
      }),
    });

    setCurrentPp((prevPp) => Math.max(0, prevPp - ppCost));
    setMyTurn(false);

    setTimeout(() => {
      setIsFighting(false);
      setCurrentAnimation(null);
      setSelectedTech(null);
      setSelectedTechType('');
      setIsBlueHit(false);
      setIsRedHit(false);
      setAnimationDirection('');
    }, 1500);
  };

  useEffect(() => {
    const fetchTrainerName = async () => {
      try {
        const token = localStorage.getItem('jwt');
        if (!token) {
          throw new Error('No authentication token found.');
        }
        const res = await fetch(`${API_URL}/api/trainer/myName`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          throw new Error(`Server responded with status: ${res.status}`);
        }
        const name = await res.text();
        if (!name) {
          throw new Error('Trainer name is empty.');
        }
        setTrainerName(name);
      } catch (err) {
        console.error('Failed to fetch trainer name:', err.message);
        setError(`Failed to load trainer information: ${err.message}`);
        setLoading(false);
      }
    };

    fetchTrainerName();
  }, [API_URL]);

  useEffect(() => {
    if (!trainerName || !monsterId) return;

    const socket = new SockJS(`${API_URL}/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('WebSocket connected successfully');
        stompClientRef.current = client;

        client.subscribe('/topic/match/*', (message) => {
          try {
            const matchResponse = JSON.parse(message.body || '{}');
            const myTeamData = matchResponse.red || {};
            const opponentTeamData = matchResponse.blue || {};

            const isBlue = myTeamData.trainerName === trainerName;
            const blueData = isBlue ? myTeamData : opponentTeamData;
            const redData = isBlue ? opponentTeamData : myTeamData;

            setBlueTeam({
              trainerName: blueData.trainerName,
              monster: blueData.monster,
              turn: blueData.turn || false,
            });
            setRedTeam({
              trainerName: redData.trainerName,
              monster: redData.monster,
              turn: redData.turn || false,
            });
            setMyTeam(isBlue ? 'blue' : 'red');
            setBlueCuketmonHP(blueData.monster?.hp || 100);
            setRedCuketmonHP(redData.monster?.hp || 100);
            setTechs(
              (isBlue ? myTeamData : opponentTeamData).monster?.skills?.map((skill, index) => ({
                id: index,
                name: skill.name || 'Unnamed',
                type: skill.type || 'normal',
                damage: skill.power || 0,
                ppCost: skill.ppCost || 20,
                animationUrl:
                  animationMap[skill.type?.toLowerCase()]?.[skill.power >= 70 ? 'high' : 'normal']?.[0] ||
                  animationMap.normal.normal[0],
              })) || []
            );
            setMyTurn(isBlue ? blueData.turn : redData.turn);
            setCurrentPp(100);
            setMaxPp(100);
            setBattleId(matchResponse.battleId || '');
            setLoading(false);
            setIsMatched(true);
          } catch (err) {
            console.error('Error parsing match data:', err);
            setError('Failed to process match data.');
          }
        });

        client.subscribe(`/topic/battle/${battleId}/*`, (message) => {
          try {
            const response = JSON.parse(message.body || '{}');
            const myTeamData = response.red;
            const opponentTeamData = response.blue;

            const isBlue = myTeamData.trainerName === trainerName;
            const blueData = isBlue ? myTeamData : opponentTeamData;
            const redData = isBlue ? opponentTeamData : myTeamData;

            setBlueCuketmonHP(blueData.monster?.hp ?? blueCuketmonHP);
            setRedCuketmonHP(redData.monster?.hp ?? redCuketmonHP);
            setCurrentPp(blueData.monster?.pp ?? currentPp);
            setMyTurn(isBlue ? blueData.turn : redData.turn);

            if (response.winner) {
              setWinner(response.winner);
              setIsBattleEnded(true);
            }

            if (response.usedTechId !== undefined && response.attacker !== trainerName) {
              const tech = techs.find((t) => t.id === response.usedTechId);
              if (tech) {
                setCurrentAnimation(tech.animationUrl);
                setIsFighting(true);
                setAnimationDirection(myTeam === 'blue' ? 'red-to-blue' : 'blue-to-red');
                setIsBlueHit(myTeam === 'blue');
                setIsRedHit(myTeam === 'red');
                setTimeout(() => {
                  setIsFighting(false);
                  setCurrentAnimation(null);
                  setIsBlueHit(false);
                  setIsRedHit(false);
                  setAnimationDirection('');
                }, 1500);
              }
            }
          } catch (err) {
            console.error('Error processing skill result:', err);
            setError('Failed to process skill result.');
          }
        });

        client.publish({
          destination: '/app/findBattle',
          body: JSON.stringify({ trainerName, monsterId }),
        });
      },
      onStompError: (frame) => {
        console.error('STOMP connection error:', frame);
        setError('WebSocket connection failed. Please try again.');
        setLoading(false);
      },
      onDisconnect: () => {
        console.log('WebSocket disconnected');
      },
    });

    client.activate();

    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, [trainerName, monsterId, API_URL, battleId]);

  if (loading) {
    return (
      <div className="loadingScreen">
        <img src="/BattlePage/loadingcircle.png" className="loadingSpinner" alt="Loading..." />
        <p>Matching...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="errorScreen">
        <p>{error}</p>
        <button onClick={() => navigate('/mypage')}>Return</button>
      </div>
    );
  }

  if (isBattleEnded) {
    const winnerImage =
      winner === 'player'
        ? myTeam === 'blue'
          ? blueTeam?.monster?.image
          : redTeam?.monster?.image
        : myTeam === 'blue'
        ? redTeam?.monster?.image
        : blueTeam?.monster?.image;
    return (
      <div className="resultScreen">
        <h1>{winner === 'player' ? 'Victory!' : 'Defeat...'}</h1>
        {winnerImage && <img src={winnerImage} className="winnerCuketmonImage" alt="Winner" />}
        <button className="endBattle" onClick={() => navigate('/mypage')}>
          End Battle
        </button>
      </div>
    );
  }

  return (
    <div className="Battle">
      <div className="content">
        <div className="battleContainer">
          {blueTeam?.trainerName && blueTeam.monster?.image && (
            <div className="blueTeamSection">
              <div className="hpBackground">
                <p>{blueTeam.trainerName}</p>
                <img
                  src="/BattlePage/hpBar.png"
                  className={myTeam === 'blue' ? 'myHpImage' : 'enemyHpImage'}
                  alt="HP Bar"
                />
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
                  className={
                    myTeam === 'blue'
                      ? `myCuketmonImage ${isBlueHit ? 'hitEffect' : ''}`
                      : `enemyCuketmonImage ${isBlueHit ? 'hitEffect' : ''}`
                  }
                  alt="Blue Team Monster"
                />
                <img
                  src="/BattlePage/stand.png"
                  className={myTeam === 'blue' ? 'myStage' : 'enemyStage'}
                  alt="Stage"
                />
              </div>
            </div>
          )}
          {redTeam?.trainerName && redTeam.monster?.image && (
            <div className="redTeamSection">
              <div className="hpBackground">
                <p>{redTeam.trainerName}</p>
                <img
                  src="/BattlePage/hpBar.png"
                  className={myTeam === 'red' ? 'myHpImage' : 'enemyHpImage'}
                  alt="HP Bar"
                />
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
                  className={
                    myTeam === 'red'
                      ? `myCuketmonImage ${isRedHit ? 'hitEffect' : ''}`
                      : `enemyCuketmonImage ${isRedHit ? 'hitEffect' : ''}`
                  }
                  alt="Red Team Monster"
                />
                <img
                  src="/BattlePage/stand.png"
                  className={myTeam === 'red' ? 'myStage' : 'enemyStage'}
                  alt="Stage"
                />
              </div>
            </div>
          )}
        </div>
        <div className="techSection">
          {!isFighting && (
            <>
              <div className="techButtons">
                {techs.map((tech, index) => (
                  <button
                    key={index}
                    className={`techButton ${selectedTech === index ? 'selected' : ''}`}
                    onClick={() => handleSelect(tech, index)}
                    onDoubleClick={() => handleFight(tech, index)}
                    disabled={currentPp < (tech.ppCost || 0) || !myTurn}
                  >
                    {tech.name}
                  </button>
                ))}
              </div>
              <div className="ppStatus">
                <span>PP: {currentPp}/{maxPp}</span>
              </div>
            </>
          )}
          {isFighting && currentAnimation && (
            <div className={`battleAnimationOverlay ${animationDirection}`}>
              <img src={currentAnimation} className="techAnimation" alt="Tech Animation" />
            </div>
          )}
          <span className="turnInfo">{myTurn ? 'My Turn' : 'Enemy Turn'}</span>
          <span className="techType">{selectedTechType ? `Type: ${selectedTechType}` : 'Type: None'}</span>
        </div>
      </div>
    </div>
  );
}

export default Battle;