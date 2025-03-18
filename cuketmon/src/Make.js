import React, { useState } from "react";
import "./Make.css";
import MenuBar from "./menubar/Menubar.js";

function Make() {
  const [type1, setType1] = useState(""); 
  const [type2, setType2] = useState(""); 
  const [description, setDescription] = useState(""); 

  const handleSubmit = async () => {
    if (!type1 || !type2 || !description.trim()) {
      alert("모든 항목을 입력해야 합니다.");
      return;
    }

    const requestData = {
      type1,
      type2,
      description,
    };

    try {
      const response = await fetch("http://백엔드-서버-주소/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        alert("데이터가 성공적으로 전송되었습니다!");
      } else {
        alert("데이터 전송에 실패했습니다.");
      }
    } catch (error) {
      console.error("전송 오류:", error);
      alert("데이터 전송에 실패했습니다.");
    }
  };

  return (
    <div>
    <div className="Make">
      <div className="Q1">
        <img src="./mypageicon.png" alt="포켓몬 아이콘" />
        <h2>원하시는 포켓몬의 타입을 선택해 주세요.</h2>
      </div>
       
        <select id="S1" value={type1} onChange={(e) => setType1(e.target.value)}>
          <option value=""></option>
          <option value="fire">불꽃</option>
          <option value="water">물</option>
          <option value="grass">풀</option>
          <option value="electric">전기</option>
          <option value="psychic">에스퍼</option>
          <option value="ice">얼음</option>
          <option value="dragon">드래곤</option>
          <option value="dark">악</option>
          <option value="fairy">페어리</option>
          <option value="fighting">격투</option>
          <option value="flying">비행</option>
          <option value="ghost">고스트</option>
          <option value="ground">땅</option>
          <option value="poison">독</option>
          <option value="rock">바위</option>
          <option value="steel">강철</option>
          <option value="bug">벌레</option>
          <option value="normal">노말</option>
        </select>
        <br/>

        <select id="S2" value={type2} onChange={(e) => setType2(e.target.value)}>
          <option value=""></option>
          <option value="fire">불꽃</option>
          <option value="water">물</option>
          <option value="grass">풀</option>
          <option value="electric">전기</option>
          <option value="psychic">에스퍼</option>
          <option value="ice">얼음</option>
          <option value="dragon">드래곤</option>
          <option value="dark">악</option>
          <option value="fairy">페어리</option>
          <option value="fighting">격투</option>
          <option value="flying">비행</option>
          <option value="ghost">고스트</option>
          <option value="ground">땅</option>
          <option value="poison">독</option>
          <option value="rock">바위</option>
          <option value="steel">강철</option>
          <option value="bug">벌레</option>
          <option value="normal">노말</option>
        </select>
        <img src='./MakePage/type.png' id="typeicon" alt="포켓몬 타입 이미지"/>

      <div className="Q2">
        <img src="./mypageicon.png" alt="포켓몬 아이콘" />
        <h2>원하시는 포켓몬의 특징을 적어주세요.</h2>
      </div>
      <div className="cukemonFeature">
        <div className="textBack">
        <textarea 
          value={description} 
          onChange={(e) => setDescription(e.target.value)}
          maxLength={1000} 
          rows={5} 
          cols={50} 
          placeholder="원하시는 포켓몬의 특징을 기입하세요."
        />
        </div>
        <p>{description.length} / 1000 자</p>
        </div>  
         
      <div className="SubmitButton">
          <p>제출하기</p>
          <img src='/button.png' id="SubmitButton" alt="제출 버튼"  onClick={handleSubmit}/>
      </div>
    </div>      
    <MenuBar />
    </div>  
  );
}

export default Make;