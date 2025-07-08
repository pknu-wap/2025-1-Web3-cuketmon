import React from 'react';
import './BattleChatbox.css';
import typeData from '../../Type'

const SkillDetail = ({ skill }) => {

  console.log('SkillDetail received skill:', skill);

  const power = skill.damage;
  const pp = skill.currentPp;

  return (
    <div className="skillDetail">
    <div className="descTitle">
      {skill.name}
    </div>
    {typeData[skill.type.toLowerCase()]?.image_url ? (
        <img
          src={typeData[skill.type.toLowerCase()]?.image_url}
          alt={skill.type}
        />
      ) : (
        ' 알 수 없음'
      )}
      <div>
        power: {power}    PP: {pp}
      </div>
    </div>
  );
};

export default SkillDetail;