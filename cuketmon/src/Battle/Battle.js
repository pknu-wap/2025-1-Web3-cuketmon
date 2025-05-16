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
  const subscriptionsRef = useRef({});
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = process.env.REACT_APP_API_URL;
  const monsterId = location.state?.monsterId;

  useEffect(() => {
    const fetchTrainerName = async () => {
      try {
        console.log('트레이너 이름을 가져오는 중...'); // 요청 전 로그
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('인증 토큰이 없습니다.');
        const res = await fetch(`${API_URL}/api/trainer/myName`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`서버 응답 상태: ${res.status}`);
        const name = await res.text();
        if (!name) throw new Error('트레이너 이름이 비어 있습니다.');
        console.log('트레이너 이름 수신:', name); // 응답 후 로그
        setTrainerName(name);
      } catch (err) {
        console.error('트레이너 이름 가져오기 오류:', err); // 에러 로그
        setError(`트레이너 정보를 불러오지 못했습니다: ${err.message}`);
        setLoading(false);
      }
    };
    fetchTrainerName();
  }, [API_URL]);

  useEffect(() => {
    const socket = new SockJS(`${API_URL}/ws?trainerName=${trainerName}`);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('WebSocket 연결됨'); // WebSocket 연결 로그
        setIsConnected(true);
        stompClientRef.current = client;

        // 매치 구독
        subscriptionsRef.current.match = client.subscribe('/topic/match/*', (message) => {
          console.log('매치 메시지 수신:', message.body); // 응답 메시지 로그
          const matchResponse = JSON.parse(message.body || '{}');
          const { red, blue, battleId, isRedFirst } = matchResponse;

          if (red.trainerName !== trainerName && blue.trainerName !== trainerName) return;

          console.log('빨간 팀 데이터:', red); // 팀 데이터 확인 로그
          console.log('파란 팀 데이터:', blue); // 팀 데이터 확인 로그
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

          // 배틀 구독 (지속적으로 유지)
          subscriptionsRef.current.battle = client.subscribe(`/topic/battle/${battleId}`, (skillMessage) => {
            console.log('배틀 메시지 수신:', skillMessage.body); // 응답 메시지 로그
            const matchResponse = JSON.parse(skillMessage.body);
            const { red, blue, isRedFirst } = matchResponse;

            const firstTeam = isRedFirst ? 'red' : 'blue';
            const secondTeam = isRedFirst ? 'blue' : 'red';

            const firstAnimationUrl = matchResponse[firstTeam].skillAnimation;
            const secondAnimationUrl = matchResponse[secondTeam].skillAnimation;

            if (firstAnimationUrl && secondAnimationUrl) {
              const firstAnimation = {
                animationUrl: firstAnimationUrl,
                isHit: secondTeam,
                hp: matchResponse[secondTeam].monster.hp,
                skills: matchResponse[firstTeam].monster.skills,
              };
              const secondAnimation = {
                animationUrl: secondAnimationUrl,
                isHit: firstTeam,
                hp: matchResponse[firstTeam].monster.hp,
                skills: matchResponse[secondTeam].monster.skills,
              };
              setAnimationQueue([firstAnimation, secondAnimation]);
            }
          });

          // 배틀 종료 구독
          subscriptionsRef.current.battleEnd = client.subscribe(`/topic/battleEnd/${battleId}/*`, (endMessage) => {
            console.log('배틀 종료 메시지 수신:', endMessage.body); // 응답 메시지 로그
            const endBattleResponse = JSON.parse(endMessage.body);
            const { result } = endBattleResponse;
            setWinner(result);
            setIsBattleEnded(true);
          });
        });

        const requestData = { trainerName, monsterId };
        console.log('/app/findBattle 에 게시함:', requestData); // 요청 전 로그
        client.publish({
          destination: '/app/findBattle',
          body: JSON.stringify(requestData),
        });
      },
      onStompError: (frame) => {
        console.error('WebSocket 오류:', frame); // WebSocket 에러 로그
        setError('WebSocket 연결에 실패했습니다.');
        setLoading(false);
      },
    });
    client.activate();
    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, [API_URL, trainerName, monsterId]);

  useEffect(() => {
    if (animationQueue.length > 0 && !isFighting) {
      const nextAnimation = animationQueue[0];
      setCurrentAnimation(nextAnimation.animationUrl);
      setIsFighting(true);
  
      setTimeout(() => {
        // 애니메이션이 끝난 후 피격 효과 설정
        if (nextAnimation.isHit === 'red') {
          setIsRedHit(true);
        } else {
          setIsBlueHit(true);
        }
  
        setTimeout(() => {
          // HP 업데이트
          if (nextAnimation.isHit === 'red') {
            setRedCuketmonHP(nextAnimation.hp);
          } else {
            setBlueCuketmonHP(nextAnimation.hp);
          }
  
          // 스킬 정보 업데이트
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
  
          // 상태 정리
          setIsFighting(false);
          setCurrentAnimation(null);
          setIsRedHit(false);
          setIsBlueHit(false);
          setAnimationQueue(prev => {
            const newQueue = prev.slice(1);
            if (newQueue.length === 0) {
              setIsTurnInProgress(false);
              // HP가 0 이하인지 확인하고 결과 전송
              if (redCuketmonHP <= 0 || blueCuketmonHP <= 0) {
                const winner = redCuketmonHP > 0 ? redTeam.trainerName : blueTeam.trainerName;
                const loser = redCuketmonHP <= 0 ? redTeam.trainerName : blueTeam.trainerName;
                sendBattleResult(winner, loser);
              }
            }
            return newQueue;
          });
        }, 500); // 피격 효과 지속 시간 (500ms)
      }, 1500); // 애니메이션 지속 시간 (1500ms)
    }
  }, [animationQueue, redCuketmonHP, blueCuketmonHP, redTeam, blueTeam]);

  const sendBattleResult = (winner, loser) => {
    const resultData = {
      winner: winner,
      loser: loser,
      battleId: battleId
    };
    console.log('승자 패자 정보 전송 중. . .:', resultData);
    stompClientRef.current.publish({
      destination: '/app/battleResult',
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
      !stompClientRef.current?.connected ||
      !battleId
    ) {
      console.log('스킬을 사용할 수 없습니다:', { skill, currentPp: skill?.currentPp, isTurnInProgress, connected: stompClientRef.current?.connected, battleId }); // 실패 조건 로그
      return;
    }

    const skillData = {
      skillId: index,
      trainerName: trainerName,
      animationUrl: skill.animationUrl,
    };
    console.log('스킬 데이터 전송:', skillData); // 요청 전 로그
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
              selected={handleSelect}
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