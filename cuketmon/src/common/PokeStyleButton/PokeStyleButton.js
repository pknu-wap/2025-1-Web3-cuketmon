import React from 'react';
import './PokeStyleButton.css';

const PokeStyleButton = ({ label = '제출하기', onClick }) => {
  return (
    <div className="poke-button" onClick={onClick}>
      <div className="text-front">{label}</div>
    </div>
  );
};

export default PokeStyleButton;
