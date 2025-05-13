import React from 'react';
import './TextBox.css';

export default function Textbox({ children }) {
  return (
    <div className="textbox">
      <div className="side-pattern left" />
      <div className="textbox-content">
        {children}
        <div className="blink-indicator">▼</div>
      </div>
      <div className="side-pattern right" />
    </div>
  );
}
