import React, { useState } from 'react';
import './BattleChatbox.css';
import SkillButton from './SkillButton';
import SkillDetail from './SkillDetail';

const BattleChatbox = ({ skills }) => {
  const [selected, setSelected] = useState(0);

  return (
    <div className="battle-chatbox">
      <div className="left-panel">
        {skills.map((skill, index) => (
          <SkillButton
            key={index}
            skill={skill}
            selected={selected === index}
            onClick={() => setSelected(index)}
          />
        ))}
      </div>
      <div className="right-panel">
        <SkillDetail skill={skills[selected]} />
      </div>
    </div>
  );
};

export default BattleChatbox;
