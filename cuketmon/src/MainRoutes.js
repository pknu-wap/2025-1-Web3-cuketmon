import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from './App';
import Make from './Make';

function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />  
      <Route path="/make" element={<Make />} /> 
    </Routes>
  );
}

export default MainRoutes;
