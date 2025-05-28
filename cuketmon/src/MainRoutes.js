import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Make from './Make/Make';
import Login from './Login/Login';
import LoginSuccess from './LoginSuccess/LoginSuccess';
import Battle from './Battle/Battle';
import Ranking from './Ranking/Ranking';
import MyPage from './MyPage/MyPage';
import MakeResult from "./MakeResult/MakeResult";
import NamePage from './NamePage/NamePage';
import PickScreen from './PickScreen/PickScreen';

function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} /> 
      <Route path="/loginSuccess" element={<LoginSuccess />} />
      <Route path="/make" element={<Make />} /> 
      <Route path="/battle" element={<Battle />} />
      <Route path="/ranking" element={<Ranking />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/MakeResult" element={<MakeResult/>} />
      <Route path="/namePage" element={<NamePage/>} />
      <Route path="/PickScreen" element={<PickScreen />} />
    </Routes>
  );
}

export default MainRoutes;
