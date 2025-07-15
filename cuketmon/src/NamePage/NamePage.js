import React, { useRef,useState, useEffect } from "react";
import { useNavigate} from "react-router-dom";
import { useAuth } from "../AuthContext";
import MenuBar from "../Menubar/Menubar.js";
import "./NamePage.css";
import NameStyleButton from '../common/PokeStyleButton/NamestyleButton.js'

function NamePage() {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { token: contextToken } = useAuth();
  const token = contextToken || localStorage.getItem('accessToken');
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
      alert("커켓몬을 두고 떠나지마요 ㅠㅠ");
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
        <div className="choiceButtons">
          <NameStyleButton label={"이름 확정하기"} onClick={handleGoTOMakePage}/>
        </div>
  
      <div className="nameInputBox">
        <div className="yourName1"> 너의 이름은 </div>
        <div className="yourName2"> 이야!</div>
        {cukemonResultImage && ( //이미지가 있는 경우에만 렌더링 하도록 함 (5/13 수정)
          <img
            src={cukemonResultImage}
            alt="커켓몬 이미지"
            className="cukemonImage"
          />
          // <div className="cuketmonImage"></div>
        )}

        <div className="nameInput">
          <input
            type="text"
            value={name}
            onChange={(e) => {
              const newValue = e.target.value;
            if (newValue.length > 6 ){
              alert("이름은 최대 6자까지 입력할 수 있습니다.")
              return;
            }}}  //이름 지정시 불필요한 코드 삭제 (5/13 수정)
            placeholder="- - - - - -"
            maxLength={6}
          />
        </div>
      </div>
      <div className="menubar">
        <MenuBar style={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }} /></div>
    </div>
  );
}

export default NamePage;
