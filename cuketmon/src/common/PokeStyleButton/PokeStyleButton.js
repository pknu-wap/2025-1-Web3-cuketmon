import React from 'react';
import './PokeStyleButton.css';

const PokeStyleButton = ({ label = '제출하기', onClick }) => {
  return (
    <div className="pokeStyleButton" onClick={onClick}>
      <div className="pokeball">
        <div className="topGroup">
          <div className="topHalf"></div>
          <div className="centerButton"></div>
        </div>
        <div className="bottomHalf"></div>
        <div className="centerLine"></div>
      </div>

      <span className="buttonText">{label}</span>
    </div>
  );
};

export default PokeStyleButton;
