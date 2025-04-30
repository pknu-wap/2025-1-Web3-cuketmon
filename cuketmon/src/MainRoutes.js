import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from './App';
import Make from './Make/Make';
import Battle from './Battle/Battle';
import Ranking from './Ranking/Ranking';
import MyPage from './MyPage/MyPage';
import MakeResult from "./MakeResult/MakeResult";
import NamePage from './NamePage/NamePage';

function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />  
      <Route path="/make" element={<Make />} /> 
      <Route path="/battle" element={<Battle />} />
      <Route path="/ranking" element={<Ranking />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/MakeResult" element={<MakeResult/>} />
      <Route path="/namePage" element={<NamePage/>} />
    </Routes>
  );
}

export default MainRoutes;
