import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import './Battle.css';
import { animationMap } from './AnimationMap';
import HpBar from '../common/HpBar/HpBar.js';
import BattleChatbox from '../common/TextBox/BattleChatbox.js';

function Battle() {
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
  const [trainerName, setTrainerName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [animationQueue, setAnimationQueue] = useState([]);
  const [isTurnInProgress, setIsTurnInProgress] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const stompClientRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = process.env.REACT_APP_API_URL;
  const monsterId = location.state?.monsterId;

  useEffect(() => {
    const fetchTrainerName = async () => {
      try {
        console.log('Fetching trainer name...'); // 요청 전 로그
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('인증 토큰이 없습니다.');
        const res = await fetch(`${API_URL}/api/trainer/myName`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`서버 응답 상태: ${res.status}`);
        const name = await res.text();
        if (!name) throw new Error('트레이너 이름이 비어 있습니다.');
        console.log('Trainer name received:', name); // 응답 후 로그
        setTrainerName(name);
      } catch (err) {
        console.error('Error fetching trainer name:', err); // 에러 로그
        setError(`트레이너 정보를 불러오지 못했습니다: ${err.message}`);
        setLoading(false);
      }
    };
    fetchTrainerName();
  }, [API_URL]);

  useEffect(() => {
    const socket = new SockJS(`${API_URL}/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('WebSocket connected'); // WebSocket 연결 로그\
        setIsConnected(true);
        stompClientRef.current = client;
      },
      onStompError: (frame) => {
        console.error('WebSocket error:', frame); // WebSocket 에러 로그
        setError('WebSocket 연결에 실패했습니다.');
        setLoading(false);
      },
    });
    client.activate();
    return () => client.deactivate();
  }, [API_URL]);

  useEffect(() => {
    console.log('useEffect triggered - monsterId:', monsterId, 'trainerName:', trainerName, 'stompClient:', !!stompClientRef.current);
    if (!stompClientRef.current || !trainerName) {
      console.log('Subscription skipped - stompClientRef:', !!stompClientRef.current, 'trainerName:', trainerName);
      return;
    }

    console.log('Subscribed to /topic/match/*'); // 구독 로그
    const matchSubscription = stompClientRef.current.subscribe('/topic/match/*', (message) => {
      console.log('Received match message:', message.body); // 응답 메시지 로그
      const matchResponse = JSON.parse(message.body || '{}');
      const { red, blue, battleId, isRedFirst } = matchResponse;

      setBattleId(battleId);
      setRedTeam(red);
      setBlueTeam(blue);
      setMyTeam(red.trainerName === trainerName ? 'red' : 'blue');
      setRedCuketmonHP(red.monster.hp);
      setBlueCuketmonHP(blue.monster.hp);
      setSkills(
        (red.trainerName === trainerName ? red : blue).monster?.skills?.map((skill, index) => ({
          id: index,
          name: skill.name,
          type: skill.type,
          damage: skill.power,
          currentPp: skill.pp,
          animationUrl: skill.skillAnimation ||
            animationMap[skill.type?.toLowerCase()]?.[skill.power >= 50 ? 'high' : 'normal']?.[0],
        })) || []
      );
      setIsRedFirst(isRedFirst);
      setLoading(false);

      if (red.trainerName !== trainerName && blue.trainerName !== trainerName) return;
    });

    const requestData = { trainerName, monsterId };
    console.log('Published to /app/findBattle:', requestData); // 요청 전 로그
    stompClientRef.current.publish({
      destination: '/app/findBattle',
      body: JSON.stringify(requestData),
    });

    return () => matchSubscription.unsubscribe();
  }, [trainerName, isConnected, monsterId]);

  useEffect(() => {
    if (!stompClientRef.current || !battleId || !myTeam) return;

    console.log(`Subscribed to /topic/battle/${battleId}/*`); // 구독 로그
    const battleSubscription = stompClientRef.current.subscribe(`/topic/battle/${battleId}/*`, (skillMessage) => {
      console.log('Received battle message:', skillMessage.body); // 응답 메시지 로그
      const matchResponse = JSON.parse(skillMessage.body);
      const { red, blue, skillAnimation, isRedFirst } = matchResponse;

      if (skillAnimation) {
        setAnimationQueue(prev => [...prev, {
          animationUrl: skillAnimation,
          isRedHit: !isRedFirst,
          isBlueHit: isRedFirst,
          redHp: red.monster.hp,
          blueHp: blue.monster.hp,
          skills: (myTeam === 'red' ? red : blue).monster.skills,
        }]);
      }
    });

    console.log(`Subscribed to /topic/battleEnd/${battleId}/*`); // 구독 로그
    const endSubscription = stompClientRef.current.subscribe(`/topic/battleEnd/${battleId}/*`, (endMessage) => {
      console.log('Received battle end message:', endMessage.body); // 응답 메시지 로그
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
      const nextAnimation = animationQueue[0];
      setCurrentAnimation(nextAnimation.animationUrl);
      setIsFighting(true);
      setIsRedHit(nextAnimation.isRedHit);
      setIsBlueHit(nextAnimation.isBlueHit);

      setTimeout(() => {
        setRedCuketmonHP(nextAnimation.redHp);
        setBlueCuketmonHP(nextAnimation.blueHp);
        setSkills(nextAnimation.skills.map((skill, index) => ({
          id: index,
          name: skill.name,
          type: skill.type,
          damage: skill.power,
          currentPp: skill.pp,
          animationUrl: skill.skillAnimation ||
            animationMap[skill.type?.toLowerCase()]?.[skill.power >= 50 ? 'high' : 'normal']?.[0],
        })));
        setIsFighting(false);
        setCurrentAnimation(null);
        setIsRedHit(false);
        setIsBlueHit(false);
        setAnimationQueue(prev => {
          const newQueue = prev.slice(1);
          if (newQueue.length === 0) setIsTurnInProgress(false);
          return newQueue;
        });
      }, 1500);
    }
  }, [animationQueue, isFighting, myTeam]);

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
      !stompClientRef.current?.connected ||
      !battleId
    ) {
      console.log('Cannot use skill:', { skill, currentPp: skill?.currentPp, isTurnInProgress, connected: stompClientRef.current?.connected, battleId }); // 실패 조건 로그
      return;
    }
  
    const skillData = {
      skillId: index,
      trainerName: trainerName,
      animationUrl: skill.animationUrl,
    };
    console.log('Sending skill data:', skillData); // 요청 전 로그
    stompClientRef.current.publish({
      destination: `/app/skill/${battleId}`,
      body: JSON.stringify(skillData),
    });
    setIsTurnInProgress(true);
  };

  if (loading) return <div className="loadingScreen"></div>;
  if (error) return (
    <div className="errorScreen">
      {error}
      <button onClick={() => navigate('/mypage')}>돌아가기</button>
    </div>
  );

  if (isBattleEnded) {
    const winnerImage = winner === trainerName ? 
      (myTeam === 'red' ? redTeam.monster.image : blueTeam.monster.image) : 
      (myTeam === 'red' ? blueTeam.monster.image : redTeam.monster.image);
    return (
      <div className="resultScreen">
        <h1>{winner === trainerName ? '승리!' : '패배...'}</h1>
        {winnerImage && <img src={winnerImage} alt="승자" />}
        <button onClick={() => navigate('/mypage')}>배틀 종료</button>
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
                  name={redTeam.trainerName}
                  currentHp={redCuketmonHP}
                  maxHp={redTeam.monster.hp}
                />
                <div className="cuketmon">
                  <img
                    src={redTeam.monster.image}
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
                  name={blueTeam.trainerName}
                  currentHp={blueCuketmonHP}
                  maxHp={blueTeam.monster.hp}
                />
                <div className="cuketmon">
                  <img
                    src={blueTeam.monster.image}
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
            <div className={`battleAnimationOverlay ${isBlueHit ? 'red-to-blue' : 'blue-to-red'}`}>
              <img src={currentAnimation} className="skillAnimation" alt="기술 애니메이션" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Battle;