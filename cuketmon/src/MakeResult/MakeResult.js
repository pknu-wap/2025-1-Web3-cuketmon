import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./MakeResult.css";
import TextBox from '../common/TextBox/TextBox.js';

function MakeResult() {
  const [cukemonImage, setCukemonImage] = useState("/MakeResultPage/movingEgg.gif");
  const [mentText, setMentText] = useState("어라...?");
  const eggRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');
  const monsterId  = localStorage.getItem('makeResultMonsterId');
  const API_URL = process.env.REACT_APP_API_URL;

  /*뒤로가기 시 커켓몬 삭제(커켓몬 생성 취소할 마지막 기회... (5/23 수정)) */
  useEffect(() => {
    window.history.pushState(null, "", window.location.pathname);
    const handlePopState = async (event) => {
      event.preventDefault();
        await fetch(
          `${API_URL}/api/monster/${monsterId}/release`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}`}
          }
        );
    };
    window.addEventListener('popstate', handlePopState);
  },[]);


  useEffect(() => {
    const delayAndFetch = () => {
      setTimeout(async () => {
        if (monsterId==null){
          console.alert("잘못된 접근입니다.");
          navigate(`/make`);
        }

        try{
          const response = await fetch(`${API_URL}/api/monster/${monsterId}/info`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json();

          if (data.image) {
            setCukemonImage(data.image);     
            localStorage.setItem("cukemonMakeResultImage", data.image);  // 이미지 표시 방법 변경(로컬스토리지에서 꺼내쓰게 함) (5/13수정)
            setMentText("처음보는 포켓몬이 나타났다!");
            navigate(`/NamePage`);
          } else {
            throw new Error("이미지 없음");
          }
        } catch (error) {
           console.error("이미지 로드 실패:", error);
           setCukemonImage("");
           setMentText("커켓몬이 도망쳤다.(다시 시도하려면 클릭)");
        }
      }, 10000);
    };

    delayAndFetch();
  }, [ token, navigate]);


  return (
    <div className="resultPage">
      {cukemonImage && (
        <img
          id="egg"
          ref={eggRef}
          src={cukemonImage}
          alt="cukemonImage"
          className="blinkEffect"
        />
      )}
 
 <div  className="chatBox">
  <TextBox>
  <textarea
    id="ment"
    readOnly
    value={mentText}
    onClick={mentText.includes("도망") ? () => navigate("/Make") : undefined}
  />
</TextBox>
</div>
    </div>
  );
}

export default MakeResult;