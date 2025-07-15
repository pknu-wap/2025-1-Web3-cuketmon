import React from 'react';
import './NamestyleButton.css';

const NamestyleButton = ({ label = '이름 확정하기', onClick }) => {
  return (
	<div className="NamestyleButton" onClick={onClick}>
	  <div className="poke-button">
		<div className="front"></div>
		</div>
	  <span className="buttonText">{label}</span>
	</div>
  );
};

export default NamestyleButton;
