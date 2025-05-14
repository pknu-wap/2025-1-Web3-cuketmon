import React, { useRef,useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Make.css";
import MenuBar from "../Menubar/Menubar.js";
import { useAuth } from "../AuthContext";
import typeData from './../Type';
import TextBox from '../common/TextBox/TextBox.js';
import PokeStyleButton from '../common/PokeStyleButton/PokeStyleButton.js';


function Make() {
  const [type1, setType1] = useState("");
  const [type2, setType2] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const { token: contextToken } = useAuth();
  const token = contextToken || localStorage.getItem('accessToken');
  const API_URL = process.env.REACT_APP_API_URL;




  const handleSubmit = async () => {

    if (!type1 && !type2) {
      alert("타입을 하나 이상 선택해야 합니다.");
      return;
    }

    if (!description.trim()) {
      alert("특징을 입력해야 합니다.");
      return;
    }

    const requestData = {
      type1,
      type2,
      description
    };

    try {
      const response = await fetch(`${API_URL}/api/monster/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      });
      if(!token){
        console.warn("토큰이 없습니다.");
        navigate(`/login`);
        }
      if (response.ok) {
        const data = await response.json();
        const monsterId = data.monsterId;
        localStorage.setItem('makeResultMonsterId', monsterId);
        navigate("/MakeResult"); 
      } else {
        alert("데이터 전송에 실패했습니다.");
      }
    } catch (error) {
      console.error("에러 발생:", error);
      alert("서버와의 통신 중 오류가 발생했습니다.");
    }
  };
  

  return (
    <div className="makeBackGround">
      <div className="make">
        <div className="Q1">
          <img src="/Menubar/mypageicon.webp" alt="포켓몬 아이콘" />
          <h2>원하는 포켓몬의 타입을 선택해 주세요.</h2>
        </div>

        <select id="S1" value={type1} onChange={(e) => setType1(e.target.value)} style={{ color: type1 ? typeData[Object.keys(typeData).find(key => typeData[key].korean === type1)]?.color : 'black' }}>
        <option value=""></option>
       {Object.values(typeData).map((type) => (
       <option key={type.korean} value={type.korean}  style={{ color: type.color }} >
       {type.korean}
       </option>
      ))}
        </select>
        <br />

       <select id="S2" value={type2} onChange={(e) => setType2(e.target.value)}style={{ color: type2 ? typeData[Object.keys(typeData).find(key => typeData[key].korean === type2)]?.color : 'black' }}>
       <option value=""></option>
       {Object.values(typeData).map((type) => (
       <option key={type.korean} value={type.korean}style={{ color: type.color }} >
       {type.korean}
       </option>
      ))}
        </select>
        <div className="Q2">
          <img src="/Menubar/mypageicon.webp" alt="포켓몬 아이콘" />
          <h2>커켓몬 특징을 나타내는 단어들을 적어주세요.</h2>
        </div>

        <div className="cukemonFeature">
        <TextBox>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={44}
              rows={3}
              cols={30}
              placeholder="영어로 기입해주세요. 예시) beige, normal/flying, sharp-beaked bird"
            />
          <p>{description.length} / 44 자</p>
          </TextBox>
        </div>
        <div className="submitButton">
          <PokeStyleButton label={"제출하기"} onClick={handleSubmit}/>
        </div>
        <MenuBar />
      </div>
    </div>
  );
}

export default Make;