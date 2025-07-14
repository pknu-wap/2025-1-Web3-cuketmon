import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Make.css";
import MenuBar from "../Menubar/Menubar.js";
import { useAuth } from "../AuthContext";
import typeData from "../Type";
import TextBox from "../common/TextBox/TextBox.js";
import PokeStyleButton from "../common/PokeStyleButton/PokeStyleButton.js";
import TypeTable from "../common/TypeTable/TypeTable.js";
import TypeButton from "./TypeButton";

function Make() {
  const [type1, setType1] = useState("");
  const [type2, setType2] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const { token: contextToken } = useAuth();
  const token = contextToken || localStorage.getItem("accessToken");
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

    const requestData = { type1, type2, description };
    try {
      const response = await fetch(`${API_URL}/api/monster/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const data = await response.json();
        const monsterId = data.monsterId;
        localStorage.setItem("makeResultMonsterId", monsterId);
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
    <div className="makePage">
      <div className="makeContent">
        <div className="leftSection">
          <h2 className="sectionTitle">01 원하는 커켓몬 타입을 선택해 주세요</h2>
          <TypeButton type1={type1} type2={type2} setType1={setType1} setType2={setType2} />
          <h2 className="sectionTitle">02 커켓몬 특징을 나타내는 영어 단어들을 적어주세요</h2>
          <TextBox>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={44}
              rows={3}
              placeholder="EX) beige, normal/flying, sharp-beaked bird"
            />
          </TextBox>

          <div className="submitButton">
            <PokeStyleButton label={"나만의 커켓몬 만들기"} onClick={handleSubmit} />
          </div>
        </div>
        <div className="rightSection">
          <TypeTable type1={type1} type2={type2} />
        </div>
        </div>
        <div className="menubar">
        <MenuBar/></div>
    </div>
  );
}

export default Make;
