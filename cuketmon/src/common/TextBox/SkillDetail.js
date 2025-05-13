import React from 'react';
import './BattleChatbox.css';

const SkillDetail = ({ skill }) => {
  return (
    <div className="skill-detail">
      <div className="desc-title">{skill.name}</div>
      <div>
        Type: {skill.type} &nbsp;&nbsp; Accuracy: {skill.accuracy}
      </div>
      <div>
        Power: {skill.power} &nbsp;&nbsp; PP: {skill.pp}
      </div>
    </div>
  );
};

export default SkillDetail;
