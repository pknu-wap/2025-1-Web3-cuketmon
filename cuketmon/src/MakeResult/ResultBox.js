import React from 'react';
import './ResultBox.css';

export default function ResultBox({ children }) {
	return (
 	  <div className="textbox">
		<div className="textbox-content">
		{children}
 		</div>
		</div>
   );
}
