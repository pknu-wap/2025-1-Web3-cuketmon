import React, { useEffect, useState } from 'react';
import './battle.css';

function Battle() {
  const [myCuketmonHP, setMyCuketmonHP] = useState(100);
  const [enemyCuketmonHP, setEnemyCuketmonHP] = useState(100);
  const [myPP, setMyPP] = useState(15);

  const [cuketmonImages, setCuketmonImages] = useState({
    myCuketmon: '/BattlePage/cuketmonex.png',
    enemyCuketmon: '/BattlePage/cuketmonex.png',
  });

  const [techs] = useState([
    { id: 1, name: '기술 1', description: '기술1', damage: 10, pp: 15 },
    { id: 2, name: '기술 2', description: '기술2', damage: 10, pp: 15 },
    { id: 3, name: '기술 3', description: '기술3', damage: 10, pp: 15 },
    { id: 4, name: '기술 4', description: '기술4', damage: 10, pp: 15 },
  ]);

  const [selectedTech, setSelectedTech] = useState(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [isFighting, setIsFighting] = useState(false);
  const [battleMessage, setBattleMessage] = useState('');

  useEffect(() => {
    setLoading(false);
    //BE 와 연동은 잘 모르겠음.
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
      setBattleMessage(`커켓몬1이 ${tech.name}을 사용했다!`);
      setIsFighting(true);

      setTimeout(() => {
        setIsFighting(false);
        setBattleMessage('');
        setSelectedTech(null);
        setDescription('');
      }, 1000);
    }
  };

  if (loading) {
    return <div className="Battle">불러오는중...</div>;
  }

  return (
    <div className="Battle">
      {isFighting ? (
        <div className="battle-animation">
          <div className="battle-container">
            <div className="cuketmon">
              <img src={cuketmonImages.myCuketmon} className="myCuketmon-img" alt="내 커켓몬" />
            </div>
            
            <div className="cuketmon">
              <img src={cuketmonImages.enemyCuketmon} className="enemyCuketmon-img" alt="적 커켓몬" />
            </div>
          </div>
          <div className="battle-message">{battleMessage}</div>
          
        </div>
      ) : (
        <div className="content">
          <div className="battle-container">
            <div className="cuketmon">
              <img src={cuketmonImages.myCuketmon} className="myCuketmon-img" alt="내 커켓몬" />
              <div className="myHpBar">
                <div className="my-hp-fill" style={{ width: `${myCuketmonHP}%` }}></div>
              </div>
            </div>
            <div className="cuketmon">
              <img src={cuketmonImages.enemyCuketmon} className="enemyCuketmon-img" alt="적 커켓몬" />
              <div className="enemyHpBar">
                <div className="enemy-hp-fill" style={{ width: `${enemyCuketmonHP}%` }}></div>
              </div>
            </div>
            <div className="battle-stage">
              <img src= "/BattlePage/stand.png" className="myStage" alt="전투무대"/>
              <img src= "/BattlePage/stand.png" className="enemyStage" alt="전투무대"/>
            </div>

            <div className="HP-background">
              <img src= "/BattlePage/HPbg.png" className="myHpBackground" alt="체력바배경"/>
              <img src= "/BattlePage/HPbg.png" className="enemyHpBackground" alt="체력바배경"/>
              <img src= "/BattlePage/HPbar.png" className="myHpImg" alt="체력바"/>
              <img src= "/BattlePage/HPbar.png" className="enemyHpImg" alt="체력바"/>
            </div>
          </div>

          <div className="tech-section">
            <img src="/BattlePage/techselect.png" className="tech-window-img" alt="기술 창" />
            <div className="tech-buttons">
              <div className="tech-row">
                <button
                  key={techs[0].id}
                  className={`tech-button ${selectedTech === techs[0].id ? 'selected' : ''}`}
                  onClick={() => handleSelect(techs[0])}
                  disabled={myPP <= 0}
                >
                  {techs[0].name}
                </button>
                <button
                  key={techs[1].id}
                  className={`tech-button ${selectedTech === techs[1].id ? 'selected' : ''}`}
                  onClick={() => handleSelect(techs[1])}
                  disabled={myPP <= 0}
                >
                  {techs[1].name}
                </button>
              </div>
              <div className="tech-row">
                <button
                  key={techs[2].id}
                  className={`tech-button ${selectedTech === techs[2].id ? 'selected' : ''}`}
                  onClick={() => handleSelect(techs[2])}
                  disabled={myPP <= 0}
                >
                  {techs[2].name}
                </button>
                <button
                  key={techs[3].id}
                  className={`tech-button ${selectedTech === techs[3].id ? 'selected' : ''}`}
                  onClick={() => handleSelect(techs[3])}
                  disabled={myPP <= 0}
                >
                  {techs[3].name}
                </button>
              </div>
            </div>
            <div className="tech-info">
              <span className="pp-info">{myPP}/15</span>
              <button className="fight-button" onClick={handleFight} disabled={!selectedTech || myPP <= 0}>
                FIGHT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Battle;