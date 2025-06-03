import React from 'react';
import './BattleChatbox.css';

const SkillDetail = ({ skill }) => {

  console.log('SkillDetail received skill:', skill);

  const accuracy = skill.accuracy ?? 'N/A';
  const power = skill.power ?? 'N/A';
  const pp = skill.pp ?? 'N/A';

  return (
    <div className="skillDetail">
      <div className="descTitle">{skill.name}</div>
      <div>
        Type: {skill.type}    Accuracy: {accuracy}
      </div>
      <div>
        Power: {power}    PP: {pp}
      </div>
    </div>
  );
};

export default SkillDetail;