import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import './Battle.css';
import { animationMap } from './AnimationMap';

function Battle() {
  const MAX_PP = 100;
  const [redTeam, setRedTeam] = useState(null);
  const [blueTeam, setBlueTeam] = useState(null);
  const [myTeam, setMyTeam] = useState(null);
  const [redCuketmonHP, setRedCuketmonHP] = useState(100);
  const [blueCuketmonHP, setBlueCuketmonHP] = useState(100);
  const [techs, setTechs] = useState([]);
  const [selectedTech, setSelectedTech] = useState(null);
  const [currentPp, setCurrentPp] = useState(MAX_PP);
  const [myTurn, setMyTurn] = useState(false);
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

  const stompClientRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = process.env.REACT_APP_API_URL;
  const monsterId = location.state?.monsterId;

  // 컴포넌트가 마운트될 때 트레이너 이름을 가져옴
  useEffect(() => {
    const fetchTrainerName = async () => {
      try {
        const token = localStorage.getItem('jwt');
        if (!token) throw new Error('인증 토큰이 없습니다.');
        const res = await fetch(`${API_URL}/api/trainer/myName`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`서버 응답 상태: ${res.status}`);
        const name = await res.text();
        if (!name) throw new Error('트레이너 이름이 비어 있습니다.');
        setTrainerName(name);
      } catch (err) {
        setError(`트레이너 정보를 불러오지 못했습니다: ${err.message}`);
        setLoading(false);
      }
    };
    fetchTrainerName();
  }, [API_URL]);

  // WebSocket 연결 및 배틀 로직
  useEffect(() => {
    if (!trainerName || !monsterId) return;

    const socket = new SockJS(`${API_URL}/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        stompClientRef.current = client;

        // 매치 업데이트를 구독
        client.subscribe('/topic/match/*', (message) => {
          const matchResponse = JSON.parse(message.body || '{}');
          const { red, blue, battleId } = matchResponse;

          setRedTeam(red);
          setBlueTeam(blue);
          setMyTeam(red.trainerName === trainerName ? 'red' : 'blue');
          setRedCuketmonHP(red.monster?.hp || 100);
          setBlueCuketmonHP(blue.monster?.hp || 100);
          setTechs(
            (red.trainerName === trainerName ? red : blue).monster?.skills?.map((skill, index) => ({
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
          setMyTurn(red.trainerName === trainerName ? red.turn : blue.turn);
          setCurrentPp((red.trainerName === trainerName ? red : blue).monster?.pp || MAX_PP);
          setBattleId(battleId);
          setLoading(false);
        });

        // 배틀 업데이트를 구독 (스킬 사용, HP, 턴 변경)
        client.subscribe(`/topic/battle/${battleId}/*`, (skillMessage) => {
          const matchResponse = JSON.parse(skillMessage.body);
          const { red, blue, attackerTeam, usedTechId, winner } = matchResponse;

          setRedTeam(red);
          setBlueTeam(blue);
          setRedCuketmonHP(red.monster?.hp ?? redCuketmonHP);
          setBlueCuketmonHP(blue.monster?.hp ?? blueCuketmonHP);
          setCurrentPp((myTeam === 'red' ? red : blue).monster?.pp ?? currentPp);
          setMyTurn(myTeam === 'red' ? red.turn : blue.turn);

          if (winner) {
            setWinner(winner);
            setIsBattleEnded(true);
          }

          if (attackerTeam && usedTechId !== undefined) {
            const tech = techs.find((t) => t.id === usedTechId);
            if (tech) {
              setCurrentAnimation(tech.animationUrl);
              setIsFighting(true);
              setIsBlueHit(attackerTeam === 'red');
              setIsRedHit(attackerTeam === 'blue');
              setTimeout(() => {
                setIsFighting(false);
                setCurrentAnimation(null);
                setIsBlueHit(false);
                setIsRedHit(false);
              }, 1500);
            }
          }
        });

        // 배틀 요청 전송
        client.publish({
          destination: '/app/findBattle',
          body: JSON.stringify({ trainerName, monsterId }),
        });
      },
      onStompError: (frame) => {
        setError('WebSocket 연결에 실패했습니다. 다시 시도해 주세요.');
        setLoading(false);
      },
    });

    client.activate();
    return () => client.deactivate();
  }, [trainerName, monsterId, API_URL, battleId]);

  // 스킬 선택 및 사용
  const handleSelect = (index) => {
    if (currentPp >= (techs[index]?.ppCost || 0) && myTurn && !isFighting) {
      setSelectedTech(index);
    }
  };

  const handleFight = (index) => {
    const tech = techs[index];
    if (
      !tech ||
      currentPp < tech.ppCost ||
      !myTurn ||
      isFighting ||
      !stompClientRef.current?.connected ||
      !battleId
    ) {
      return;
    }

    stompClientRef.current.publish({
      destination: `/app/skill/${battleId}`,
      body: JSON.stringify({
        skillId: index,
        trainerName: trainerName,
      }),
    });
    setSelectedTech(index);
    setIsFighting(true);
  };

  const getHpColor = (hp) => {
    const hue = Math.max(0, Math.min(120, hp * 1.2));
    return `hsl(${hue}, 100%, 50%)`;
  };


  if (loading) return <div className="loadingScreen">매칭 중...</div>;
  if (error) return <div className="errorScreen">{error}<button onClick={() => navigate('/mypage')}>돌아가기</button></div>;

  
  if (isBattleEnded) {
    const winnerImage = winner === trainerName ? (myTeam === 'red' ? redTeam?.monster?.image : blueTeam?.monster?.image) : (myTeam === 'red' ? blueTeam?.monster?.image : redTeam?.monster?.image);
    return (
      <div className="resultScreen">
        <h1>{winner === trainerName ? '승리!' : '패배...'}</h1>
        {winnerImage && <img src={winnerImage} className="winnerCuketmonImage" alt="승자" />}
        <button onClick={() => navigate('/mypage')}>배틀 종료</button>
      </div>
    );
  }

  
  return (
    <div className="Battle">
      <div className="content">
        <div className="battleContainer">
          {/* 왼쪽: 레드 팀 섹션 */}
          <div className="redTeamSection">
            {redTeam?.trainerName && redTeam.monster?.image && (
              <>
                <div className="hpBackground">
                  <p>{redTeam.trainerName}</p>
                  <img src="/BattlePage/hpBar.png" className={myTeam === 'red' ? 'myHpImage' : 'enemyHpImage'} alt="HP 바" />
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
                    alt="레드 팀 몬스터"
                  />
                  <img src="/BattlePage/stand.png" className={myTeam === 'red' ? 'myStage' : 'enemyStage'} alt="스테이지" />
                </div>
              </>
            )}
          </div>

          {/* 오른쪽: 블루 팀 섹션 */}
          <div className="blueTeamSection">
            {blueTeam?.trainerName && blueTeam.monster?.image && (
              <>
                <div className="hpBackground">
                  <p>{blueTeam.trainerName}</p>
                  <img src="/BattlePage/hpBar.png" className={myTeam === 'blue' ? 'myHpImage' : 'enemyHpImage'} alt="HP 바" />
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
                    alt="블루 팀 몬스터"
                  />
                  <img src="/BattlePage/stand.png" className={myTeam === 'blue' ? 'myStage' : 'enemyStage'} alt="스테이지" />
                </div>
              </>
            )}
          </div>
        </div>

        {/* 기술 및 턴 섹션 */}
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
                    disabled={currentPp < tech.ppCost || !myTurn}
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
            <div className={`battleAnimationOverlay ${myTeam === 'red' ? 'red-to-blue' : 'blue-to-red'}`}>
              <img src={currentAnimation} className="techAnimation" alt="기술 애니메이션" />
            </div>
          )}
          <span className="turnInfo">{myTurn ? '내 턴' : '상대 턴'}</span>
          <span className="techType">
            {selectedTech !== null ? `타입: ${techs[selectedTech]?.type || '없음'}` : '타입: 없음'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Battle;