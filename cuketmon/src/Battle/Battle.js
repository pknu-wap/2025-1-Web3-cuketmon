import React, { useEffect, useState } from 'react';
import './Battle.css';


function Battle() {
  const [myCuketmonHP, setMyCuketmonHP] = useState(100);
  const [enemyCuketmonHP, setEnemyCuketmonHP] = useState(100);
  const [myPP, setMyPP] = useState(15);
  const [cuketmonImages, setCuketmonImages] = useState({
    myCuketmon: '/BattlePage/cuketmonex.png',
    enemyCuketmon: '/BattlePage/cuketmonex.png',
  }); //이것도 이미지대로 받아오는걸로 바꿔야함.

  const [techs, setTechs] = useState([]); //이 파트는 백앤드와 연동하면 없애고, useState([])으로 받아온 기술정보대로 입력되게 해야함. .json 형식 조율필요? 아직 임의로 표시만 되게 놔둔 것.

  const [selectedTech, setSelectedTech] = useState(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [isFighting, setIsFighting] = useState(false);
  const [battleMessage, setBattleMessage] = useState('');
  const [currentAnimation, setCurrentAnimation] = useState(null);
  const [isPlayerHit, setIsPlayerHit] = useState(false); // 커켓몬1이 맞았는지
  const [isEnemyHit, setIsEnemyHit] = useState(false);   // 커켓몬2가 맞았는지

  const animationMap = {
    fire:{
      high: [],
      normal: []
    },
    water:{
      high: [],
      normal: []
    },
    normal:{
      high: [],
      normal: []
    },
    grass:{
      high: [],
      normal: ['/BattlePage/animation/grass/normal_damage1.png']
    },
    electric:{
      high: [],
      normal: []
    },
    psychc:{
      high: [],
      normal: []
    },
    rock:{
      high: [],
      normal: []
    },
    iron:{
      high: [],
      normal: []
    },
    ice:{
      high: [],
      normal: []
    },
    dragon:{
      high: [],
      normal: []
    },
    evil:{
      high: [],
      normal: []
    },
    fairy:{
      high: [],
      normal: []
    },
    poison:{
      high: [],
      normal: []
    },
    bug:{
      high: [],
      normal: []
    },
    ground:{
      high: [],
      normal: []
    },
    fly:{
      high: [],
      normal: []
    },
    fighter:{
      high: [],
      normal: []
    },
    ghost:{
      high: [],
      normal: []
    }
  };

  useEffect(() => {
    const mockData = [
      { id: 1, name: '잎날가르기', type: 'grass', damage: 10, description: '잎날가르기' },
    ];
    const updatedTechs = mockData.map(tech => {
      const damageLevel = tech.damage >= 70 ? 'high' : 'normal';
      const animations = animationMap[tech.type][damageLevel];
      const randomIndex = Math.floor(Math.random() * animations.length);
      return { ...tech, animationUrl: animations[randomIndex] };
    });
    setTechs(updatedTechs);
    setLoading(false);
    /*fetch('api/DontKnowWhereIshouldBringMyDataFrom')
    .then(response => response.json())
    .then(data => {
      const updatedTechs = data.map(tech => {
        const damageLevel = tech.damage >= 70 ? 'high' : 'normal';
        const animations = animationMap[tech.type][damageLevel];
        const randomIndex = Math.floor(Math.random() * animations.length);
        return {
          ...tech, animationUrl: animations[randomIndex],
        };
    });
    setTechs(updatedTechs);
    setLoading(false);
  })
    .catch(error => {
      console.error('API 미응답, 나중에 빼기', error);
      setLoading(false);
    }); */
  }, []);

  const handleSelect = (tech) => {
    if (myPP > 0) {
      setSelectedTech(tech.id);
      setDescription(tech.description);
    }
  };

  const handleFight = () => {
    if (selectedTech && myPP > 0) {
      const tech = techs.find(t => t.id === selectedTech);
      const damage = tech.damage;
      setEnemyCuketmonHP((prev) => Math.max(prev - damage, 0));
      setMyPP((prev) => Math.max(prev - 1, 0));
      setBattleMessage(`커켓몬1이 ${tech.description}을 사용했다!`);
      setCurrentAnimation(tech.animationUrl);
      setIsFighting(true);

      setTimeout(() => {
        setIsFighting(false);
        setIsEnemyHit(true);
        setBattleMessage('으아아아아아아아ㅏ악!!!');
        setSelectedTech(null);
        setDescription('');
        setCurrentAnimation(null);

        setTimeout(() => {
          setIsEnemyHit(false);
        }, 500);
      }, 1000);
    }
  };

  if (loading) {
    return <div className="Battle">불러오는중...</div>;
  }

  return (
    <div className="Battle">
      <div className="content">
        <div className="battleContainer">
          <div className="cuketmon">
            <img src={cuketmonImages.myCuketmon} 
            className={`myCuketmonImage ${isPlayerHit ? 'hitEffect' : ''}`}
            alt="내 커켓몬" />
            <div className="myHpBar">
              <div className="myHpFill" style={{ width: `${myCuketmonHP}%` }}></div>
            </div>
          </div>
          <div className="cuketmon">
            <img src={cuketmonImages.enemyCuketmon} 
            className={`enemyCuketmonImage ${isEnemyHit ? 'hitEffect': ''}`}
              alt="적 커켓몬" />
            <div className="enemyHpBar">
              <div className="enemyHpFill" style={{ width: `${enemyCuketmonHP}%` }}></div>
            </div>
          </div>
          {/* 전투 애니메이션과 메시지 */}
          {isFighting && (
            <div className="battleAnimationOverlay">
              <img src={techs.find(t => t.id === selectedTech)?.animationUrl}
                className="techAnimation"
                alt="기술 애니메이션"/>
              <div className="battleMessage">{battleMessage}</div>
            </div>
          )}
          <div className="battleStage">
            <img src="/BattlePage/stand.png" className="myStage" alt="전투무대" />
            <img src="/BattlePage/stand.png" className="enemyStage" alt="전투무대" />
          </div>
          <div className="hpBackground">
            <img src="/BattlePage/HPbg.png" className="myHpBackground" alt="체력바배경" />
            <img src="/BattlePage/HPbg.png" className="enemyHpBackground" alt="체력바배경" />
            <img src="/BattlePage/HPbar.png" className="myHpImage" alt="체력바" />
            <img src="/BattlePage/HPbar.png" className="enemyHpImage" alt="체력바" />
          </div>
        </div>
        {/* 기술 선택 UI는 전투 중 숨김 */}
        {!isFighting && (
          <div className="techSection">
            <img src="/BattlePage/techselect.png" className="techWindowImg" alt="기술 창" />
            <div className="techButtons">
              {techs.map(tech => (
                <button
                  key={tech.id}
                  className={`techButton ${selectedTech === tech.id ? 'selected' : ''}`}
                  onClick={() => handleSelect(tech)}
                  disabled={myPP <= 0}
                >
                  {tech.name}
                </button>
              ))}
            </div>
            <div className="techInfo">
              <span className="ppInfo">{myPP}/15</span>
              <button className="fightButton" onClick={handleFight} disabled={!selectedTech || myPP <= 0}>
                FIGHT
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Battle;