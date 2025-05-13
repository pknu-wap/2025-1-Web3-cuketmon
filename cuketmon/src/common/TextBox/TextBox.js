import React from 'react';
import './TextBox.css';

export default function Textbox({ children }) {
  return (
    <div className="textbox">
      <div className="sidePattern left" />
      <div className="textboxContent">
        {children}
        <div className="blinkIndicator">▼</div>
      </div>
      <div className="sidePattern right" />
    </div>
  );
}
