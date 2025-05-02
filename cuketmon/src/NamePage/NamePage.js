import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "./NamePage.css";

function NamePage() {
  const [name, setName] = useState("");
  const [cukemonImage, setCukemonImage] = useState("/Menubar/egg.png");
  const navigate = useNavigate();
  const { token } = useAuth();
  const location = useLocation();
  const maxLength = 12;
  const API_URL = process.env.REACT_APP_API_URL;

  const monsterId = location.state?.monsterId; //MakeResult에서 받은 monsterId 출력
  console.log(monsterId);

  const base64Image = location.state?.image; //MakeResult에서 base64로 받아오기
  console.log(base64Image);

  useEffect(() => {
    if (base64Image) {
      setCukemonImage(base64Image);
    }
  }, [base64Image]);

  const namingCukemon = (e) => {
    if (e.target.value.length <= maxLength) {
      setName(e.target.value);
    }
  };

  const handleGoToMypage = async () => {
    if (!name.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/monster/${monsterId}/name`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) throw new Error("이름 저장 실패");

      alert("커켓몬이 생성되었습니다.");
      navigate(`/mypage?token=${token}`);
    } catch (err) {
      console.error("커켓몬 이름 설정 오류:", err);
      alert("이름 저장 실패");
    }
  };

  const handleGoTOMakePage = async()=>{
    navigate(`/make?token=${token}`)
  }

  return (
    <div className="namePage">
      <div className="nameInputBox">
        <p>Your name?</p>
        {cukemonImage && (
          <img
            src={cukemonImage}
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

        <div className="choiceButtons">
          <img src="/button.png" id="remake"  onClick={handleGoTOMakePage}/>
          <img src="/button.png" id="bringToMypage" onClick={handleGoToMypage} />
          <span id="buttonText1">재부화</span>
          <span id="buttonText2">데려가기</span>
        </div>
      </div>
    </div>
  );
}

export default NamePage;
