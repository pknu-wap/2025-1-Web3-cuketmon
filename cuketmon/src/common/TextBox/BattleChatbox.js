import React, { useState } from 'react';
import './BattleChatbox.css';
import SkillButton from './SkillButton';
import SkillDetail from './SkillDetail';

const BattleChatbox = ({ skills, onUse }) => {
  const [selected, setSelected] = useState(0);

  return (
    <div className="battleChatbox">
      <div className="leftPanel">
        {skills.map((skill, index) => (
          <SkillButton
            key={index}
            skill={skill}
            selected={selected === index}
            onClick={() => setSelected(index)}
            onUse={() => onUse(index)}
          />
        ))}
      </div>
      <div className="rightPanel">
        <SkillDetail skill={skills[selected]} />
      </div>
    </div>
  );
};

export default BattleChatbox;