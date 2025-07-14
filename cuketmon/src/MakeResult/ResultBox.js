import React from 'react';
import './ResultBox.css';

export default function ResultBox({ children }) {
  return (
    <div className="textbox">
      <div className="textboxContent">
        {children}

      </div>
      <div className="sidePattern right" />
    </div>
  );
}