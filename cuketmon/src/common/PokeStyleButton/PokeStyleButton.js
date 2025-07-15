import React from 'react';
import './PokeStyleButton.css';

const PokeStyleButton = ({ label = '제출하기', onClick }) => {
  return (
	<div className="PokeStyleButton" onClick={onClick}>
	  <div className="poke-button">
		<div className="front"></div>
		</div>
	  <span className="buttonText">{label}</span>
	</div>
  );
};

export default PokeStyleButton;
