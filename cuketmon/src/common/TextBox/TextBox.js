import React from 'react';
import './TextBox.css';

export default function Textbox({ children }) {
  return (
    <div className="TextBoxContainer">
      <div className="whiteBox">
        {children}
       
      </div>
    </div>
  );
}
