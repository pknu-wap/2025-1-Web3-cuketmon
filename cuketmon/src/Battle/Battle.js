import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import './Battle.css';
import { animationMap } from './AnimationMap';

function Battle() {
  const MAX_PP = 100;
  const [blueCuketmonHP, setBlueCuketmonHP] = useState(100);
  const [redCuketmonHP, setRedCuketmonHP] = useState(100);
  const [techs, setTechs] = useState([]);
  const [selectedTech, setSelectedTech] = useState(null);
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
  const [currentPp, setCurrentPp] = useState(MAX_PP);
  const stompClientRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = process.env.REACT_APP_API_URL;


  const monsterId = location.state?.monsterId;

  const getHpColor = (hp) => {
    const hue = Math.max(0, Math.min(120, hp * 1.2));
    return `hsl(${hue}, 100%, 50%)`;
  };

  const handleSelect = (index) => {
    if (currentPp >= (techs[index]?.ppCost || 0) && myTurn && !isFighting) {
      setSelectedTech(index);
    }
  };

  const handleFight = (index) => {
    const tech = techs[index];
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
      return;
    }

    const ppCost = tech.ppCost;
    const animationUrl = tech.animationUrl;

    setSelectedTech(index);
    setCurrentAnimation(animationUrl);
    setIsFighting(true);
    setIsBlueHit(myTurn ? myTeam !== 'blue' : myTeam === 'blue');
    setIsRedHit(myTurn ? myTeam !== 'red' : myTeam === 'red');

    stompClientRef.current.publish({
      destination: `/app/skill/${battleId}`,
      body: JSON.stringify({
        skillId: index,
        trainerName: trainerName,
      }),
    });
    console.log('Skill used:', trainerName, index);

    setCurrentPp((prevPp) => Math.max(0, prevPp - ppCost));
    setMyTurn(false);

    setTimeout(() => {
      setIsFighting(false);
      setCurrentAnimation(null);
      setSelectedTech(null);
      setIsBlueHit(false);
      setIsRedHit(false);
    }, 1500);
  };

  useEffect(() => {
    const fetchTrainerName = async () => {
      try {
        const token = localStorage.getItem('jwt');
        if (!token) throw new Error('No authentication token found.');
        const res = await fetch(`${API_URL}/api/trainer/myName`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Server responded with status: ${res.status}`);
        const name = await res.text();
        if (!name) throw new Error('Trainer name is empty.');
        setTrainerName(name);
        console.log('Trainer name fetched:', name);
      } catch (err) {
        setError(`Failed to load trainer information: ${err.message}`);
        setLoading(false);
      }
    };

    fetchTrainerName();
  }, [API_URL]);

  useEffect(() => {
    console.log('Second useEffect - trainerName:', trainerName, 'monsterId:', monsterId);
    if (!trainerName) {
      return;
    }

    if (!monsterId) {
      setError('Missing monster ID.');
      setLoading(false);
      return;
    }

    const socket = new SockJS(`${API_URL}/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        stompClientRef.current = client;

        client.subscribe('/topic/match/*', (message) => {
          const matchResponse = JSON.parse(message.body || '{}');
          console.log('Received matchResponse:', matchResponse);
          const myTeamData = matchResponse.red;
          const opponentTeamData = matchResponse.blue;

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
              name: skill.name,
              type: skill.type,
              damage: skill.power,
              ppCost: skill.ppCost,
              animationUrl:
                animationMap[skill.type?.toLowerCase()]?.[skill.power >= 50 ? 'high' : 'normal']?.[0] ||
                animationMap.normal.normal[0],
            })) || []
          );
          setMyTurn(isBlue ? blueData.turn : redData.turn);
          setCurrentPp(MAX_PP);
          setBattleId(matchResponse.battleId || '');
          setLoading(false);
          setIsMatched(true);

          client.subscribe(`/topic/battle/${battleId}/*`, (skillMessage) => {
            const matchResponse = JSON.parse(skillMessage.body || '{}');
            console.log('Received battle matchResponse:', matchResponse);
            const myTeamData = matchResponse.red;
            const opponentTeamData = matchResponse.blue;

            const isBlue = myTeamData.trainerName === trainerName;
            const blueData = isBlue ? myTeamData : opponentTeamData;
            const redData = isBlue ? opponentTeamData : myTeamData;

            setBlueCuketmonHP(blueData.monster?.hp ?? blueCuketmonHP);
            setRedCuketmonHP(redData.monster?.hp ?? redCuketmonHP);
            setCurrentPp(blueData.monster?.pp ?? currentPp);
            setMyTurn(isBlue ? blueData.turn : redData.turn);

            if (matchResponse.winner) {
              setWinner(matchResponse.winner);
              setIsBattleEnded(true);
            }

            if (matchResponse.usedTechId !== undefined && matchResponse.attacker !== trainerName) {
              const tech = techs.find((t) => t.id === matchResponse.usedTechId);
              if (tech) {
                setCurrentAnimation(tech.animationUrl);
                setIsFighting(true);
                setIsBlueHit(myTurn ? myTeam !== 'blue' : myTeam === 'blue');
                setIsRedHit(myTurn ? myTeam !== 'red' : myTeam === 'red');
                setTimeout(() => {
                  setIsFighting(false);
                  setCurrentAnimation(null);
                  setIsBlueHit(false);
                  setIsRedHit(false);
                }, 1500);
              }
            }
          });

          client.subscribe(`/topic/battleEnd/${battleId}/*`, (endMessage) => {
            const response = JSON.parse(endMessage.body || '{}');
            console.log('Received End Response:', matchResponse);
            setWinner(response.winner);
            setIsBattleEnded(true);
          });
        });

        client.publish({
          destination: '/app/findBattle',
          body: JSON.stringify({ trainerName, monsterId }),
        });
        console.log('Battle request sent:' ,{trainerName, monsterId});
      },
      onStompError: (frame) => {
        setError('WebSocket connection failed. Please try again.');
        setLoading(false);
      },
    });

    client.activate();

    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, [trainerName, monsterId, API_URL]);

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
          전투종료
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
                    onClick={() => handleSelect(index)}
                    onDoubleClick={() => handleFight(index)}
                    disabled={currentPp < (tech.ppCost || 0) || !myTurn}
                  >
                    {tech.name}
                  </button>
                ))}
              </div>
              <div className="ppStatus">
                <span>PP: {currentPp}/{MAX_PP}</span>
              </div>
            </>
          )}
          {isFighting && currentAnimation && (
            <div className={`battleAnimationOverlay ${myTurn ? (myTeam === 'blue' ? 'blue-to-red' : 'red-to-blue') : (myTeam === 'blue' ? 'red-to-blue' : 'blue-to-red')}`}>
              <img src={currentAnimation} className="techAnimation" alt="Tech Animation" />
            </div>
          )}
          <span className="turnInfo">{myTurn ? 'My Turn' : 'Enemy Turn'}</span>
          <span className="techType">
            {selectedTech !== null ? `Type: ${techs[selectedTech]?.type || 'None'}` : 'Type: None'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Battle;