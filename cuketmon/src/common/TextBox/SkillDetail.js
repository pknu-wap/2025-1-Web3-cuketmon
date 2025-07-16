import React from 'react';
import './BattleChatbox.css';
import typeData from '../../Type'

const SkillDetail = ({ skill }) => {

  console.log('SkillDetail received skill:', skill);

  const power = skill.damage;
  const pp = skill.currentPp;

  return (
    <div className="skillDetail">
      <span>
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
        <div className='skillInfo'>
          <p>
            power: {power} 
          </p>
          <p>
            PP: {pp}
          </p>
        </div>
      </span>

    </div>
  );
};

export default SkillDetail;