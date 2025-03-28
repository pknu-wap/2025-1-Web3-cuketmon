import React, { useEffect, useState } from 'react';
import './Battle.css';


function Battle() {
  const [myCuketmonHP, setMyCuketmonHP] = useState(100);
  const [enemyCuketmonHP, setEnemyCuketmonHP] = useState(100);
  const [myPP, setMyPP] = useState(15);
  const [cuketmonImages, setCuketmonImages] = useState({
    myCuketmon: '/BattlePage/cuketmonex.png',
    enemyCuketmon: '/BattlePage/cuketmonex.png'}); //이것도 이미지대로 받아오는걸로 바꿔야함.
  const [techs, setTechs] = useState([]); //이 파트는 백앤드와 연동하면 없애고, useState([])으로 받아온 기술정보대로 입력되게 해야함. .json 형식 조율필요? 아직 임의로 표시만 되게 놔둔 것.
  const [selectedTech, setSelectedTech] = useState(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [isFighting, setIsFighting] = useState(false);
  const [battleMessage, setBattleMessage] = useState('');
  const [currentAnimation, setCurrentAnimation] = useState(null);
  const [isPlayerHit, setIsPlayerHit] = useState(false); // 커켓몬1이 맞았는지
  const [isEnemyHit, setIsEnemyHit] = useState(false);   // 커켓몬2가 맞았는지
  const [fontLoaded, setFontLoaded] = useState(false);

  const animationMap = {
    fire:{
      high: ['/BattlePage/animation/fire/high_damage1.png'],
      normal: ['/BattlePage/animation/fire/normal_damage1.png']
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
      high: ['/BattlePage/animation/grass/high_damage1.png'],
      normal: ['/BattlePage/animation/grass/normal_damage1.png']
    },
    electric:{
      high: [],
      normal: []
    },
    psychic:{
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
    const font = new FontFace('PokemonGSK2Mono', "url('/Font/PokemonGSK2Mono.ttf')");
  font.load().then(() => {
    document.fonts.add(font);
    setFontLoaded(true);
  }).catch(err => {
    console.error('Font load failed:', err);
    setFontLoaded(true); // 폰트 로드 실패 시에도 렌더링 진행
  });



    const mockData = [
      { id: 1, name: '잎날가르기', type: 'grass', damage: 10, description: '잎날가르기'},
      {id: 2, name: '불 퉤퉤', type: 'fire', damage: 80, description: '불퉤퉤'},
      {id: 3, name: '불 퉤에에에', type: 'fire', damage: 20, description: '불퉤퉤'},
      { id: 4, name: '새싹빔', type: 'grass', damage: 70, description: '새싹빔'}
    ];
    const updatedTechs = mockData.map(tech => {
      const damageLevel = tech.damage >= 70 ? 'high' : 'normal';
      const animations = animationMap[tech.type][damageLevel]; //데미지레벨 분류에 따라 애니메이션
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

  const handleFight = (tech) => {
    if (myPP > 0) {
      setSelectedTech(tech.id);
      const damage = tech.damage;
      setEnemyCuketmonHP((prev) => Math.max(prev - damage, 0));
      setMyPP((prev) => Math.max(prev - 1, 0));
      setBattleMessage(`커켓몬1이 ${tech.description}을 사용했다!`);
      setCurrentAnimation(tech.animationUrl);
      setIsFighting(true)

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
            <img
              src={cuketmonImages.myCuketmon}
              className={`myCuketmonImage ${isPlayerHit ? 'hitEffect' : ''}`}
              alt="내 커켓몬"
            />
            <div className="myHpBar">
              <div className="myHpFill" style={{ width: `${myCuketmonHP}%` }}></div>
            </div>
          </div>
          <div className="cuketmon">
            <img
              src={cuketmonImages.enemyCuketmon}
              className={`enemyCuketmonImage ${isEnemyHit ? 'hitEffect' : ''}`}
              alt="적 커켓몬"
            />
            <div className="enemyHpBar">
              <div className="enemyHpFill" style={{ width: `${enemyCuketmonHP}%` }}></div>
            </div>
          </div>
          {isFighting && (
            <div className="battleAnimationOverlay">
              <img
                src={techs.find(t => t.id === selectedTech)?.animationUrl}
                className="techAnimation"
                alt="기술 애니메이션"
              />
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
        {!isFighting && (
          <div className="techSection">
            <img src="/BattlePage/techselect.png" className="techWindowImg" alt="기술 창" />
            <div className="techButtons">
              {techs.map(tech => (
                <button
                  key={tech.id}
                  className={`techButton ${selectedTech === tech.id ? 'selected' : ''}`}
                  onClick={() => handleSelect(tech)}
                  onDoubleClick={() => handleFight(tech)}
                  disabled={myPP <= 0}
                >
                  {tech.name}
                </button>
              ))}
            </div>
            <div className="techInfo">
              <span className="ppInfo">{myPP}/15</span>
              <span className="cuketmonType">
                {techs.length > 0 ? techs[0].type : '없음'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Battle;