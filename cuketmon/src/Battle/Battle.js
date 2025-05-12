import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import './Battle.css';
import { animationMap } from './AnimationMap';

function Battle() {
  const MAX_PP = 100; // 최대 PP 값
  const [redTeam, setRedTeam] = useState(null); // 레드 팀 정보
  const [blueTeam, setBlueTeam] = useState(null); // 블루 팀 정보
  const [myTeam, setMyTeam] = useState(null); // 내 팀 (레드 또는 블루)
  const [redCuketmonHP, setRedCuketmonHP] = useState(100); // 레드 팀 몬스터 HP
  const [blueCuketmonHP, setBlueCuketmonHP] = useState(100); // 블루 팀 몬스터 HP
  const [techs, setTechs] = useState([]); // 내 몬스터의 기술 목록
  const [selectedTech, setSelectedTech] = useState(null); // 선택된 기술 인덱스
  const [currentPp, setCurrentPp] = useState(MAX_PP); // 현재 PP
  const [myTurn, setMyTurn] = useState(false); // 내 턴 여부
  const [prevMyTurn, setPrevMyTurn] = useState(false); // 이전 턴 상태 추적
  const [isFighting, setIsFighting] = useState(false); // 전투 중 여부 (애니메이션 재생 중)
  const [currentAnimation, setCurrentAnimation] = useState(null); // 현재 재생 중인 애니메이션 URL
  const [isRedHit, setIsRedHit] = useState(false); // 레드 팀 피격 여부
  const [isBlueHit, setIsBlueHit] = useState(false); // 블루 팀 피격 여부
  const [battleId, setBattleId] = useState(''); // 배틀 ID
  const [winner, setWinner] = useState(null); // 승자 이름
  const [isBattleEnded, setIsBattleEnded] = useState(false); // 배틀 종료 여부
  const [trainerName, setTrainerName] = useState(''); // 내 트레이너 이름
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 메시지

  const stompClientRef = useRef(null); // WebSocket 클라이언트 참조
  const navigate = useNavigate(); // 페이지 이동을 위한 네비게이션 훅
  const location = useLocation(); // 현재 경로 정보
  const API_URL = process.env.REACT_APP_API_URL; // API URL 환경 변수
  const monsterId = location.state?.monsterId; // 몬스터 ID (라우터 상태에서 가져옴)

  // 트레이너 이름 가져오기
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

        // 매치 업데이트 구독
        client.subscribe('/topic/match/*', (message) => {
          const matchResponse = JSON.parse(message.body || '{}');
          console.log('매치 응답 수신:', matchResponse); // 응답 데이터 로그
          const { red, blue, battleId } = matchResponse;

          setRedTeam(red);
          setBlueTeam(blue);
          setMyTeam(red.trainerName === trainerName ? 'red' : 'blue');
          setRedCuketmonHP(red.monster?.hp);
          setBlueCuketmonHP(blue.monster?.hp);
          setTechs(
            (red.trainerName === trainerName ? red : blue).monster?.skills?.map((skill, index) => ({
              id: index,
              name: skill.name,
              type: skill.type,
              damage: skill.power,
              ppCost: skill.pp,
              animationUrl:
                animationMap[skill.type?.toLowerCase()]?.[skill.power >= 50 ? 'high' : 'normal']?.[0] ||
                animationMap.normal.normal[0],
            })) || []
          );
          setMyTurn(red.trainerName === trainerName ? red.turn : blue.turn);
          setPrevMyTurn(red.trainerName === trainerName ? red.turn : blue.turn);
          setCurrentPp(MAX_PP);
          setBattleId(battleId);
          setLoading(false);
        });

        // 배틀 업데이트 구독
        client.subscribe(`/topic/battle/${battleId}/*`, (skillMessage) => {
          const matchResponse = JSON.parse(skillMessage.body || '{}');
          console.log('배틀 응답 수신:', matchResponse); // 응답 데이터 로그
          const { red, blue, animationUrl, winner } = matchResponse;

          setRedTeam(red);
          setBlueTeam(blue);
          setRedCuketmonHP(red.monster?.hp ?? redCuketmonHP);
          setBlueCuketmonHP(blue.monster?.hp ?? blueCuketmonHP);
          const newMyTurn = myTeam === 'red' ? red.turn : blue.turn; // myTeam 이 'red' 이면 red.turn 사용, 아니면 blue.turn 사용
          setMyTurn(newMyTurn);

          if (winner) {
            setWinner(winner);
            setIsBattleEnded(true);
          }

          // 턴 변화를 기반으로 공격자 판단
          if (prevMyTurn && !newMyTurn) {
            // 내가 공격함 (myTurn: true -> false)
            setCurrentAnimation(techs[selectedTech]?.animationUrl);
            setIsFighting(true);
            setIsBlueHit(myTeam === 'red');
            setIsRedHit(myTeam === 'blue');
          } else if (!prevMyTurn && newMyTurn && animationUrl) {
            // 상대가 공격함 (myTurn: false -> true)
            setCurrentAnimation(animationUrl);
            setIsFighting(true);
            setIsBlueHit(myTeam === 'red');
            setIsRedHit(myTeam === 'blue');
          }

          if (isFighting) {
            setTimeout(() => {
              setIsFighting(false);
              setCurrentAnimation(null);
              setIsBlueHit(false);
              setIsRedHit(false);
            }, 1500);
          }

          setPrevMyTurn(newMyTurn);
        });

        // 배틀 요청 전송
        const requestData = { trainerName, monsterId };
        console.log('배틀 요청 전송:', requestData); // 요청 데이터 로그
        client.publish({
          destination: '/app/findBattle',
          body: JSON.stringify(requestData),
        });
      },
      onStompError: (frame) => {
        setError('WebSocket 연결에 실패했습니다. 다시 시도해 주세요.');
        setLoading(false);
      },
    });

    client.activate();
    return () => client.deactivate();
  }, [trainerName, monsterId, API_URL, battleId, myTeam, prevMyTurn, selectedTech, techs]);

  // 기술 선택 및 사용
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

    const skillData = {
      skillId: index,
      trainerName: trainerName,
      animationUrl: tech.animationUrl, // 서버로 애니메이션 URL 전송
    };
    console.log('스킬 사용 요청 전송:', skillData); // 요청 데이터 로그
    stompClientRef.current.publish({
      destination: `/app/skill/${battleId}`,
      body: JSON.stringify(skillData),
    });
    setSelectedTech(index);
    setIsFighting(true);
    setCurrentPp((prev) => Math.max(0, prev - tech.ppCost));
  };

  // HP 바 색상 계산
  const getHpColor = (hp) => {
    const hue = Math.max(0, Math.min(120, hp * 1.2));
    return `hsl(${hue}, 100%, 50%)`;
  };

  // 로딩 및 에러 상태
  if (loading) return (
    <div className="loadingScreen">
      <img src="/BattlePage/loadingcircle.png" alt="로딩 중..." />
    </div>
  );
  if (error) return <div className="errorScreen">{error}<button onClick={() => navigate('/mypage')}>돌아가기</button></div>;

  // 배틀 종료 화면
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

  // 메인 배틀 UI
  return (
    <div className="Battle">
      <div className="content">
        <div className="battleContainer">
          {/* 레드 팀 섹션 */}
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

          {/* 블루 팀 섹션 */}
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
            {selectedTech !== null ? `타입: ${techs[selectedTech]?.type || ''}` : '타입: 없음'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Battle;