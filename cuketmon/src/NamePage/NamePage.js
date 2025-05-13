import React, { useRef,useState, useEffect } from "react";
import { useNavigate} from "react-router-dom";
import { useAuth } from "../AuthContext";
import "./NamePage.css";
import PokeStyleButton from '../common/PokeStyleButton/PokeStyleButton.js'
function NamePage() {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { token: contextToken } = useAuth();
  const token = contextToken || localStorage.getItem('jwt');
  const API_URL = process.env.REACT_APP_API_URL;
  const cukemonResultImage = localStorage.getItem('cukemonMakeResultImage')
  const monsterId = localStorage.getItem("makeResultMonsterId");

//뒤로가기 막기 
 const backBlockRef = useRef(false); 
useEffect(() => {
  const preventGoBack = (event) => {
    if (event.type === "popstate") {
      if (backBlockRef.current) return;
      backBlockRef.current = true;
      alert("커켓몬을 두고 떠나지마요 ㅠㅠㅠ");
      window.history.go(1);
      setTimeout(() => {
        backBlockRef.current = false;
      }, 500);
    }
  };
  window.history.pushState(null, "", window.location.href);
  window.addEventListener("popstate", preventGoBack);
  return () => {
    window.removeEventListener("popstate", preventGoBack);
  };
}, []);

  /*데려가기*/
  const handleGoToMypage = async () => {
    if (!name.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/monster/${monsterId}/name`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) throw new Error("이름 저장 실패");
      alert("커켓몬이 생성되었습니다.");
      navigate(`/mypage`);
    } catch (err) {
      console.error("커켓몬 이름 설정 오류:", err);
      alert("이름 저장 실패");
    }
  };

   /*재부화*/
  const handleGoTOMakePage = async()=>{
        const res = await fetch(`${API_URL}/api/monster/${monsterId}/release`, {
          method: "DELETE",
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`오류발생`);
        navigate(`/make`)
    }


  return (
    <div className="namePage">
      <div className="nameInputBox">
        <p>Your name?</p>
        {cukemonResultImage && ( //이미지가 있는 경우에만 렌더링 하도록 함 (5/13 수정)
          <img
            src={cukemonResultImage}
            alt="커켓몬 이미지"
            className="cukemonImage"
          />
        )}

        <div className="nameInput">
          ▶
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}  //이름 지정시 불필요한 코드 삭제 (5/13 수정)
            placeholder="커켓몬 이름 입력"
            maxLength={12}
          />
          <div id="remainWord">{name.length}/12자</div>
        </div>

        <div className="choiceButtons">
          <div className="remakeButton">
          <PokeStyleButton  label={"재부화"} onClick={handleGoTOMakePage}/>
          </div>

          <div className="bringButton">
          <PokeStyleButton  label={"데려가기"} onClick={handleGoToMypage} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NamePage;
