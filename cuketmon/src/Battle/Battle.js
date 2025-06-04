import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import './Battle.css';
import { animationMap } from './AnimationMap';
import HpBar from '../common/HpBar/HpBar.js';
import BattleChatbox from '../common/TextBox/BattleChatbox.js';
import PokeStyleButton from '../common/PokeStyleButton/PokeStyleButton.js';

function Battle() {
  const redCuketmonRef = useRef(null);
  const blueCuketmonRef = useRef(null);
  const [redTeam, setRedTeam] = useState(null);
  const [blueTeam, setBlueTeam] = useState(null);
  const [myTeam, setMyTeam] = useState(null);
  const [redCuketmonHP, setRedCuketmonHP] = useState(100);
  const [blueCuketmonHP, setBlueCuketmonHP] = useState(100);
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [currentPp, setCurrentPp] = useState(0);
  const [isRedFirst, setIsRedFirst] = useState(false);
  const [isFighting, setIsFighting] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState(null);
  const [isRedHit, setIsRedHit] = useState(false);
  const [isBlueHit, setIsBlueHit] = useState(false);
  const [battleId, setBattleId] = useState('');
  const [winner, setWinner] = useState(null);
  const [isBattleEnded, setIsBattleEnded] = useState(false);
  const [battleMessage, setBattleMessage] = useState('');
  const [trainerName, setTrainerName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [animationQueue, setAnimationQueue] = useState([]);
  const [isTurnInProgress, setIsTurnInProgress] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [showRotateMessage, setShowRotateMessage] = useState(false);
  const [showFullscreenMessage, setShowFullscreenMessage] = useState(false);
  const nextAnimation = animationQueue[0];

  const stompClientRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = process.env.REACT_APP_API_URL;
  const monsterId = location.state.monsterId;

  useEffect(() => {
    const fetchTrainerName = async () => {
      try {
        console.log('Fetching trainer name...');
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('인증 토큰이 없습니다.');
        const res = await fetch(`${API_URL}/api/trainer/myName`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`서버 응답 상태: ${res.status}`);
        const name = await res.text();
        if (!name) throw new Error('트레이너 이름이 비어 있습니다.');
        console.log('Trainer name received:', name);
        setTrainerName(name);
      } catch (err) {
        console.error('Error fetching trainer name:', err);
        setError(`트레이너 정보를 불러오지 못했습니다: ${err.message}`);
        setLoading(false);
      }
    };
    fetchTrainerName();
  }, [API_URL]);

  useEffect(() => {
    if (!trainerName) return;
    const socket = new SockJS(`${API_URL}/ws?trainerName=${trainerName}`);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        stompClientRef.current = client;
      },
      onStompError: (frame) => {
        console.error('WebSocket error:', frame);
        setError('WebSocket 연결에 실패했습니다.');
        setLoading(false);
      },
    });
    client.activate();
    return () => client.deactivate();
  }, [trainerName, API_URL]);

  useEffect(() => {
    console.log('useEffect triggered - monsterId:', monsterId, 'trainerName:', trainerName, 'stompClient:', !!stompClientRef.current);
    if (!stompClientRef.current || !trainerName) {
      console.log('Subscription skipped - stompClientRef:', !!stompClientRef.current, 'trainerName:', trainerName);
      return;
    }

    console.log('Subscribed to /topic/match/*');
    const matchSubscription = stompClientRef.current.subscribe('/topic/match/*', (message) => {
      const matchResponse = JSON.parse(message.body || '{}');
      const { red, blue, battleId, isRedFirst } = matchResponse;

      if (red.trainerName !== trainerName && blue.trainerName !== trainerName) return;

      console.log('Received match message:', message.body);

      setBattleId(battleId);
      setRedTeam(red);
      setBlueTeam(blue);
      setMyTeam(red.trainerName === trainerName ? 'red' : 'blue');
      setRedCuketmonHP(red.monster.hp);
      setBlueCuketmonHP(blue.monster.hp);
      setSkills(
        (red.trainerName === trainerName ? red : blue).monster.skills.map((skill, index) => ({
          id: index,
          name: skill.name,
          type: skill.type,
          damage: skill.power,
          currentPp: skill.pp
        })) || []
      );
      setIsRedFirst(isRedFirst);
      setLoading(false);
    });

    const requestData = { trainerName, monsterId };
    console.log('Published to /app/findBattle:', requestData);
    stompClientRef.current.publish({
      destination: '/app/findBattle',
      body: JSON.stringify(requestData),
    });

    return () => matchSubscription.unsubscribe();
  }, [trainerName, isConnected, monsterId]);

  useEffect(() => {
    if (!stompClientRef.current || !battleId || !myTeam) return;

    console.log(`Subscribed to /topic/battle/${battleId}`);
    const battleSubscription = stompClientRef.current.subscribe(`/topic/battle/${battleId}`, (skillMessage) => {
      console.log('Received battle message:', skillMessage.body);
      const matchResponse = JSON.parse(skillMessage.body);
      const { red, blue, isRedFirst } = matchResponse;

      const firstTeam = isRedFirst ? 'red' : 'blue';
      const secondTeam = isRedFirst ? 'blue' : 'red';

      const firstAnimationUrl = matchResponse[firstTeam].skillAnimation;
      const secondAnimationUrl = matchResponse[secondTeam].skillAnimation;

      if (firstAnimationUrl && secondAnimationUrl) {
        const firstAnimation = {
          monster: matchResponse[firstTeam].monster,
          trainerName: matchResponse[firstTeam].trainerName,
          animationUrl: firstAnimationUrl,
          isHit: secondTeam,
          hp: matchResponse[secondTeam].monster.hp,
          skills: matchResponse[firstTeam].monster.skills,
          skillName: matchResponse[firstTeam].skillName
        };

        const secondAnimation = {
          monster: matchResponse[secondTeam].monster,
          trainerName: matchResponse[secondTeam].trainerName,
          animationUrl: secondAnimationUrl,
          isHit: firstTeam,
          hp: matchResponse[firstTeam].monster.hp,
          skills: matchResponse[secondTeam].monster.skills,
          skillName: matchResponse[secondTeam].skillName
        };

        setAnimationQueue([firstAnimation, secondAnimation]);
      }
    });

    console.log(`Subscribed to /topic/battleEnd/${battleId}/*`);
    const endSubscription = stompClientRef.current.subscribe(`/topic/battleEnd/${battleId}/*`, (endMessage) => {
      console.log('Received battle end message:', endMessage.body);
      const endBattleResponse = JSON.parse(endMessage.body);
      const { result } = endBattleResponse;
      setWinner(result);
      setIsBattleEnded(true);
    });

    return () => {
      battleSubscription.unsubscribe();
      endSubscription.unsubscribe();
    };
  }, [battleId, myTeam]);

  useEffect(() => {
    if (animationQueue.length > 0 && !isFighting) {
      setCurrentAnimation(nextAnimation.animationUrl);
      setBattleMessage(`${nextAnimation.monster.name} 이 ${nextAnimation.skillName} 을 사용했다!`);
      setIsFighting(true);
      const damage = nextAnimation.isHit === 'red' ? redCuketmonHP - nextAnimation.hp : blueCuketmonHP - nextAnimation.hp;

      setTimeout(() => {
        if (nextAnimation.isHit === 'red') {
          setIsRedHit(true);
          setBattleMessage(
            damage >= 70 ? '효과는 매우 대단했다!' : 
            damage >= 50 ? '효과는 대단했다!' : 
            damage <= 30 ? '효과는 별로였다.' : 
            '효과가 있었다!'
          );
        } else {
          setIsBlueHit(true);
          setBattleMessage(
            damage >= 70 ? '효과는 매우 대단했다!' : 
            damage >= 50 ? '효과는 대단했다!' : 
            damage <= 30 ? '효과는 별로였다.' : 
            '효과가 있었다!'
          );
        }

        setTimeout(() => {
          if (nextAnimation.isHit === 'red') {
            setRedCuketmonHP(nextAnimation.hp);
          } else {
            setBlueCuketmonHP(nextAnimation.hp);
          }

          if (myTeam === (isRedFirst ? 'red' : 'blue') && animationQueue.length === 2) {
            setSkills(nextAnimation.skills.map((skill, index) => ({
              id: index,
              name: skill.name,
              type: skill.type,
              damage: skill.power,
              currentPp: skill.pp,
              animationUrl: skill.skillAnimation
            })));
          } else if (myTeam === (isRedFirst ? 'blue' : 'red') && animationQueue.length === 1) {
            setSkills(nextAnimation.skills.map((skill, index) => ({
              id: index,
              name: skill.name,
              type: skill.type,
              damage: skill.power,
              currentPp: skill.pp,
              animationUrl: skill.skillAnimation
            })));
          }

          if (nextAnimation.hp <= 0) {
            const winner = nextAnimation.isHit === 'red' ? blueTeam.trainerName : redTeam.trainerName;
            sendBattleResult(winner);
            setWinner(winner);
            setIsBattleEnded(true);
          }

          setIsFighting(false);
          setCurrentAnimation(null);
          setIsRedHit(false);
          setIsBlueHit(false);
          setAnimationQueue(prev => {
            const newQueue = prev.slice(1);
            if (newQueue.length === 0) {
              setIsTurnInProgress(false);
            }
            return newQueue;
          });
        }, 500);
      }, 1000);
    }
  }, [animationQueue, isFighting, myTeam, isRedFirst]);

  const sendBattleResult = (winner) => {
    const resultData = {
      winnerName: winner
    };
    console.log('Sending battle result:', resultData);
    stompClientRef.current.publish({
      destination: `/app/endBattle/${battleId}`,
      body: JSON.stringify(resultData),
    });
  };

  const handleSelect = (index) => {
    if (!isTurnInProgress) {
      setSelectedSkill(index);
      setCurrentPp(skills[index].currentPp);
    }
  };

  const handleFight = (index) => {
    const skill = skills[index];
    if (
      !skill ||
      skill.currentPp <= 0 ||
      isTurnInProgress ||
      !stompClientRef.current.connected ||
      !battleId
    ) {
      console.log('Cannot use skill:', { skill, currentPp: skill.currentPp, isTurnInProgress, connected: stompClientRef.current.connected, battleId });
      return;
    }

    const skillData = {
      skillId: index,
      trainerName: trainerName,
      skillName: skills[index].name,
      animationUrl: animationMap[skill.type?.toLowerCase()]?.[skill.power >= 50 ? 'high' : 'normal']?.[0]
    };
    console.log('Sending skill data:', skillData);
    stompClientRef.current.publish({
      destination: `/app/skill/${battleId}`,
      body: JSON.stringify(skillData),
    });
    setIsTurnInProgress(true);
  };


useEffect(() => {
  const isMobileDevice = /Mobi|Android/i.test(navigator.userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  if (isMobileDevice) {
    if (isIOS) {
      setShowRotateMessage(true);
    } else {
      // ESLint no-restricted-globals 우회: window.screen 사용
      setTimeout(() => {
        if (window.screen.orientation.type.startsWith('portrait')) {
          window.screen.orientation.lock('landscape').then(() => {
            document.documentElement.requestFullscreen();
          }).catch(err => {
            console.error('화면 고정 실패:', err);
            setShowRotateMessage(true);
          });
        } else {
          document.documentElement.requestFullscreen();
        }
      }, 100); // 100ms 지연
    }
  }

  const orientationChangeHandler = () => {
    if (window.screen.orientation.type.startsWith('portrait')) {
      setShowRotateMessage(false);
    }
  };

  const fullscreenChangeHandler = () => {
    if (!document.fullscreenElement) {
      setShowFullscreenMessage(true);
    } else {
      setShowFullscreenMessage(false);
    }
  };

  window.screen.orientation.addEventListener('change', orientationChangeHandler);
  document.addEventListener('fullscreenchange', fullscreenChangeHandler);

  return () => {
    window.screen.orientation.removeEventListener('change', orientationChangeHandler);
    document.removeEventListener('fullscreenchange', fullscreenChangeHandler);
  };
}, []);

  const handleTapForFullscreen = () => {
    document.documentElement.requestFullscreen();
    setShowRotateMessage(false);
  };

  if (loading) return (
    <div className="loadingScreen"></div>
  );
  if (error) return (
    <div className="errorScreen">
      {error}
      <button onClick={() => navigate('/mypage')}>돌아가기</button>
    </div>
  );

  if (isBattleEnded) {
    const myMonsterImage = myTeam === 'red' ? redTeam.monster.image : blueTeam.monster.image;
    const message = winner === trainerName ? '승리!' : '패배...';
    
    return (
      <div className="resultScreen">
        <h1>{message}</h1>
        {myMonsterImage && <img src={myMonsterImage} alt="자기 몬스터" className="winnerCuketmonImage"/>}
        <div className="battleEndButton"><PokeStyleButton onClick={() => navigate('/mypage')}>배틀 종료</PokeStyleButton></div>
      </div>
    );
  }
  return (
    <div className="Battle">
      <div className="content">
        <div className="battleContainer">
          <div className="redTeamSection">
            {redTeam?.trainerName && redTeam.monster?.image && (
              <>
                <HpBar
                  name={redTeam.monster.name}
                  currentHp={redCuketmonHP}
                  maxHp={redTeam.monster.hp}
                />
                <div className="cuketmon">
                  <img
                    src={redTeam.monster.image} ref={redCuketmonRef}
                    className={myTeam === 'red' ? `myCuketmonImage ${isRedHit ? 'hitEffect' : ''}` : `enemyCuketmonImage ${isRedHit ? 'hitEffect' : ''}`}
                    alt="레드 팀 몬스터"
                  />
                </div>
              </>
            )}
          </div>

          <div className="blueTeamSection">
            {blueTeam?.trainerName && blueTeam.monster?.image && (
              <>
                <HpBar
                  name={blueTeam.monster.name}
                  currentHp={blueCuketmonHP}
                  maxHp={blueTeam.monster.hp}
                />
                <div className="cuketmon">
                  <img
                    src={blueTeam.monster.image} ref={blueCuketmonRef}
                    className={myTeam === 'blue' ? `myCuketmonImage ${isBlueHit ? 'hitEffect' : ''}` : `enemyCuketmonImage ${isBlueHit ? 'hitEffect' : ''}`}
                    alt="블루 팀 몬스터"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="skillSection">
          {!isTurnInProgress && (
            <BattleChatbox 
              skills={skills} 
              onUse={handleFight} 
              onSelect={handleSelect}
              isTurnInProgress={isTurnInProgress} 
            />
          )}
          {isFighting && currentAnimation && (
            <div className="battleAnimationOverlay">
              <img
                src={currentAnimation}
                className="skillAnimation"
                alt="기술 애니메이션"
                style={{
                  left: nextAnimation.isHit === 'blue'
                    ? `${redCuketmonRef.current.offsetLeft}px`
                    : `${blueCuketmonRef.current.offsetLeft}px`,
                  animation: 'spriteAnimation 1s steps(6) forwards',
                  transform: nextAnimation.isHit === 'blue' ? 'scaleX(1)' : 'scaleX(-1)',
                  '--endX': nextAnimation.isHit === 'blue'
                    ? `${blueCuketmonRef.current.offsetLeft}px`
                    : `${redCuketmonRef.current.offsetLeft}px`,
                }}
              />
              {battleMessage && <div className="battleMessage">{battleMessage}</div>}
            </div>
          )}
        </div>
      </div>
      {showRotateMessage && (
        <div className="overlay" onClick={handleTapForFullscreen}>
          <p>기기를 가로로 회전하고 탭하여 전체 화면으로 전환하세요.</p>
        </div>
      )}
      {showFullscreenMessage && (
        <div className="notification">최적의 경험을 위해 전체 화면 모드를 활성화하세요.</div>
      )}
    </div>
  );
}

export default Battle;