import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Make.css";
import MenuBar from "../Menubar/Menubar.js";

function Make() {
  const [type1, setType1] = useState("");
  const [type2, setType2] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();


  const handleSubmit = async () => {
    if (!(type1 || type2) || !description.trim()) {
      alert("타입을 하나 이상 선택하고, 모든 항목을 입력해야 합니다.");
      return;
    }

    const requestData = {
      type1,
      type2,
      description,
    };

    try {
      const response = await fetch("/monster/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        alert("데이터가 성공적으로 전송되었습니다!");
        navigate("/MakeResult");
      } else {
        alert("데이터 전송에 실패했습니다.");
        alert("근데 임의로 /MakeResult로 이동하게 만들어둠 나중에 빼야함 !!!!");
        navigate("/MakeResult");//임의로 /MakeResult로 이동할수 있게만든 코드 나중에 꼭 빼야함!!! 
      }
    } catch (error) {
      console.error("전송 오류:", error);
      alert("데이터 전송에 실패했습니다.");

    }
  };

  const types = [
    "불꽃", "물", "풀", "전기", "에스퍼", "얼음", "드래곤", "악", "페어리", "격투", "비행", "고스트", "땅", "독", "바위", "강철", "벌레", "노말",
  ];

  return (
    <div className="makeBackGround">
      <div className="make">
        <div className="Q1">
          <img src="./Menubar/mypageicon.png" alt="포켓몬 아이콘" />
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
        <img src="./MakePage/type.png" id="typeicon" alt="포켓몬 타입 이미지" />

        <div className="Q2">
          <img src="./Menubar/mypageicon.png" alt="포켓몬 아이콘" />
          <h2>원하시는 포켓몬의 특징을 적어주세요.</h2>
        </div>

        <div className="cukemonFeature">
          <div className="textBack">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={35}
              rows={5}
              cols={50}
              placeholder="원하시는 포켓몬의 특징을 기입하세요."
            />
          </div>
          <p>{description.length} / 35 자</p>
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
