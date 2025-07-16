import React from 'react';
import { BrowserRouter as Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login/Login';
import './App.css';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
      </Routes>
  );
}

export default App;
  