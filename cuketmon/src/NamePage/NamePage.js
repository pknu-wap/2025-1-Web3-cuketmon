import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { useAuth } from '../AuthContext';
import "./NamePage.css";

function NamePage() {
  const [name, setName] = useState("");
  const [pokemonImage, setPokemonImage] = useState("/Menubar/egg.png"); // 임시 이미지 백엔드 연동시 바꿀 예정
  const navigate = useNavigate();
  const maxLength = 12;
  const { token } = useAuth(); 

  useEffect(() => {
    if (name) {
      fetch(`/monster/{monsterId}/info`)
        .then((response) => response.json())
        .then((data) => {
          setPokemonImage(data.imageUrl);
        })
        .catch((error) => {
          console.error("이미지 로드 실패:", error);
        });
    }
  }, [name]);

  const namingCukemon = (e) => {
    if (e.target.value.length <= maxLength) {
      setName(e.target.value);
    }
  };

  const handleGoToMypage = () => {

    if (name.trim().length > 0) {
      if (token){
      alert("커켓몬이 생성되었습니다.");
      navigate("/mypage?token="+token);
    } 
    } else {
      alert("이름을 입력해주세요.");
    }
  };

  return (
    <div className="namePage">
      <div className="nameInputBox">
        <p>Your name?</p>
        {pokemonImage && (
          <img
            src={pokemonImage}
            alt="커켓몬 이미지"
            className="cukemonImage"
          />
        )}

        <div className="nameInput">
          ▶
          <input
            type="text"
            value={name}
            onChange={namingCukemon}
            placeholder="커켓몬 이름을 입력해주세요."
            maxLength={maxLength}
          />
          <div id="remainWord">{name.length}/{maxLength}자</div>
        </div>

        <div className='choiceButtons'>
        <img src="/button.png" id="remake"  />
        <img src="/button.png" id="bringToMypage" onClick={handleGoToMypage} />
        <span id="buttonText1">재부화</span>
        <span id="buttonText2">데려가기</span>
        </div>
      </div>
    </div>
  );
}

export default NamePage;

