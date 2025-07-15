import React, { useRef } from 'react';

const SkillButton = ({ skill, selected, onSelect, onUse, disabled }) => {
  const clickTimeout = useRef(null);

  const handleClick = () => {
    if (disabled) return;

    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
      onUse(); // 더블 클릭 시 기술 사용
    } else {
      clickTimeout.current = setTimeout(() => {
        onSelect(); // 단일 클릭 시 기술 선택
        clickTimeout.current = null;
      }, 300); // 300ms 내에 더블 클릭 여부 확인
    }
  };

  return (
    <div
      className={`moveButton ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={handleClick}
    >
      {skill.name}
    </div>
  );
};

export default SkillButton;