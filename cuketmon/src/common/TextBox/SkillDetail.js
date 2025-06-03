import React from 'react';
import './BattleChatbox.css';

const SkillDetail = ({ skill }) => {

  console.log('SkillDetail received skill:', skill);

  const power = skill.damage;
  const pp = skill.currentPp;

  return (
    <div className="skillDetail">
      <div className="descTitle">{skill.name}</div>
      <div>
        Type: {skill.type}
      </div>
      <div>
        Power: {power}    PP: {pp}
      </div>
    </div>
  );
};

export default SkillDetail;