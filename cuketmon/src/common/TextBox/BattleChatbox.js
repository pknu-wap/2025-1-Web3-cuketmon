import React, { useState } from 'react';
import SkillButton from './SkillButton';

const BattleChatbox = ({ skills, onUse, isTurnInProgress }) => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="battleChatbox">
      {skills.map((skill, index) => (
        <SkillButton
          key={index}
          skill={skill}
          selected={selected === index}
          onSelect={() => setSelected(index)}
          onUse={() => onUse(index)}
          disabled={isTurnInProgress || skill.currentPp <= 0}
        />
      ))}
    </div>
  );
};

export default BattleChatbox;