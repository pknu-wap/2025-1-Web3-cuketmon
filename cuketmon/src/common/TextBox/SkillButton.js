import React from 'react';
import './BattleChatbox.css';

const SkillButton = ({ skill, selected, onClick }) => {
  return (
    <div
      className={`moveButton ${selected ? 'selected' : ''}`}
      onClick={onClick}
    >
      {skill.name}
    </div>
  );
};

export default SkillButton;
