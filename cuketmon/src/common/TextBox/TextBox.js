import React from 'react';
import './TextBox.css';

export default function Textbox({ children }) {
  return (
      <div className="textbox-content">
      <div className="sidePattern left" />
      <div className="textboxContent">
        {children}
      <div className="sidePattern right" />
    </div>
    <div className="textbox-bar" />
    </div>
  );
}
