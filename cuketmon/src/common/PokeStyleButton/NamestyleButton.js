import React from 'react';
import './NamestyleButton.css';

const NamestyleButton = ({ label = '이름 확정하기', onClick }) => {
  return (
    <div className="name-button" onClick={onClick}>
      <div className="text-front">{label}</div>
    </div>
  );
};

export default NamestyleButton;
