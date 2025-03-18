import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from './App';
import Make from './Make';
import Battle from './battle';
import Ranking from './ranking';
import MyPage from './mypage';
import MakeResult from "./MakeResult";
function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />  
      <Route path="/make" element={<Make />} /> 
      <Route path="/battle" element={<Battle />} />
      <Route path="/ranking" element={<Ranking />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/MakeResult" element={<MakeResult/>} />
    </Routes>
  );
}

export default MainRoutes;
