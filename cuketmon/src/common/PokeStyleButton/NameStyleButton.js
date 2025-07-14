import React from 'react';
import './NamestyleButton.css';

const NamestyleButton = ({ label = '제출하기', onClick }) => {
  return (
    <button className="poke-button" onClick={onClick}>
      <span className="text-front">{label}</span>
    </button>
  );
};

export default NamestyleButton;