import React from 'react';
import './TextBox.css';

export default function Textbox({ children }) {
  return (
    <div className="textbox-outer">
      <div className="textbox-middle">
        <div className="textbox-inner">
          <div className="textbox-content">
      <div className="sidePattern left" />
      <div className="textboxContent">
        {children}
        </div>
        <div className="blinkIndicator">▼</div>
      </div>
      <div className="sidePattern right" />
    </div>
    <div className="textbox-bar" />
    </div>
    </div>
  );
}
