import React from 'react';
import './BattleChatbox.css';
import typeData from '../../Type'

const SkillDetail = ({ skill }) => {

  console.log('SkillDetail received skill:', skill);

  const power = skill.damage;
  const pp = skill.currentPp;

  return (
    <div className="skillDetail">
      <p className="descTitle">
        {skill.name}
      </p>
      {typeData[skill.type.toLowerCase()]?.image_url ? (
          <img
            src={typeData[skill.type.toLowerCase()]?.image_url}
            alt={skill.type}
          />
        ) : (
          ' 알 수 없음'
        )}
        <p>
          power: {power}    PP: {pp}
        </p>
    </div>
  );
};

export default SkillDetail;