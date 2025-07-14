import React from 'react';
import './PokeStyleButton.css';

const PokeStyleButton = ({ label = '제출하기', onClick }) => {
  return (
    <button className="poke-button" onClick={onClick}>
      <span className="text-under">{label}</span>
      <span className="text-right">{label}</span>
      <span className="text-left">{label}</span>
      <span className="text-up">{label}</span>
      <span className="text1">{label}</span>
      <span className="text2">{label}</span>
      <span className="text3">{label}</span>
      <span className="text4">{label}</span>
      <span className="text5">{label}</span>
      <span className="text6">{label}</span>
      <span className="text-front">{label}</span>
    </button>
  );
};

export default PokeStyleButton;