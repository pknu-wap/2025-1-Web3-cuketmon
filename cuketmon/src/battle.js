/*랭킹 화면 */
import React, {useEffect, useState} from 'react';
import MenuBar from "./menubar/Menubar.js";
import './battle.css';

function Battle() {
  const [myCuketmon, setMyCuketmon] = useState("");
  const [enemyCuketmon, setEnemyCuketmon] = useState("");
  const [hpBar, setHpBar] = useState(100);
  const [enemyHpBar, setEnemyHpBar] = useState(100);
  const techs = [
    { id: 1, name: '기술 1', description: '기술1' },
    { id: 2, name: '기술 2', description: '기술2' },
    { id: 3, name: '기술 3', description: '기술3' },
    { id: 4, name: '기술 4', description: '기술4' },
  ];

  const [selectedTech, setselectedTech] = useState(null);
  const [description, setDescription] = useState('');

  
  return (
    <div className= 'Battle'>
        <img src="/BattlePage/battlebg.png" alt="배경" className="background"/>
        <div className='myCuketmon'>
         <img src='/BattlePage/cuketmonex.png' alt='myCuketmon'/></div>
         <div className='enemyCuketmon'>
         <img src='/BattlePage/cuketmonex.png' alt='enemyCuketmon'/></div>
        
      <div className='selectSkill'>

      </div>

    </div>
   
  );
}

export default Battle;
