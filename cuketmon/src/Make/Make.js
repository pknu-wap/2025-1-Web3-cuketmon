import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Make.css";
import MenuBar from "../Menubar/Menubar.js";
import { useAuth } from "../AuthContext";

function Make() {
  const [type1, setType1] = useState("");
  const [type2, setType2] = useState("");
  const [description, setDescription] = useState("");
  const [tokenFromURL, setTokenFromURL] = useState("");  // token 상태 추가
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const API_URL = process.env.REACT_APP_API_URL;
  
  useEffect(() => {
    const searchParams = decodeURIComponent(window.location.search);
    const params = new URLSearchParams(searchParams);
    const token = params.get("token");

    console.log(API_URL);
    console.log("추출된 token:", token); 

    if (token) {
      setTokenFromURL(token);  
      setToken(token);  
      localStorage.setItem("jwt", token); 
    } else {
      console.log("토큰이 없습니다.");
    }
  }, [setToken]);

  const handleSubmit = async () => {
    if (!(type1 || type2) || !description.trim()) {
      alert("타입을 하나 이상 선택하고, 모든 항목을 입력해야 합니다.");
      return;
    }

    const requestData = {
      type1,
      type2,
      description
    };
    

    try {
      const response = await fetch(`${API_URL}/monster/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${tokenFromURL}`
        },
        body: JSON.stringify(requestData)
      });
    
      if (response.ok) {
        const monsterId = await response.json();
        localStorage.setItem('monsterId', monsterId.toString());
        navigate("/MakeResult");
      } else {
        alert("데이터 전송에 실패했습니다.");
        navigate("/MakeResult");
      }
    } catch (error) {
      console.error("에러 발생:", error);
      alert("서버와의 통신 중 오류가 발생했습니다.");
    }
  };

  const types = [
    "불꽃", "물", "풀", "전기", "에스퍼", "얼음", "드래곤", "악", "페어리",
    "격투", "비행", "고스트", "땅", "독", "바위", "강철", "벌레", "노말",
  ];

  return (
    <div className="makeBackGround">
      <div className="make">
        <div className="Q1">
          <img src="/Menubar/mypageicon.png" alt="포켓몬 아이콘" />
          <h2>원하시는 포켓몬의 타입을 선택해 주세요.</h2>
        </div>

        <select id="S1" value={type1} onChange={(e) => setType1(e.target.value)}>
          <option value=""></option>
          {types.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <br />

        <select id="S2" value={type2} onChange={(e) => setType2(e.target.value)}>
          <option value=""></option>
          {types.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <img src="/MakePage/type.png" id="typeicon" alt="포켓몬 타입 이미지" />

        <div className="Q2">
          <img src="/Menubar/mypageicon.png" alt="포켓몬 아이콘" />
          <h2>커켓몬 특징을 나타내는 단어들을 적어주세요.</h2>
        </div>

        <div className="cukemonFeature">
          <div className="textBack">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={44}
              rows={5}
              cols={50}
              placeholder="영어로 기입해주세요. 예시) beige, normal/flying, sharp-beaked bird"
            />
          </div>
          <p>{description.length} / 44 자</p>
        </div>

        <div className="submitButton">
          <p>제출하기</p>
          <img
            src="/button.png"
            id="submitButton"
            alt="제출 버튼"
            onClick={handleSubmit}
          />
        </div>

        <MenuBar />
      </div>
    </div>
  );
}

export default Make;
