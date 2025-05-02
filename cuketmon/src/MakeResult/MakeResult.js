import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./MakeResult.css";

function MakeResult() {
  const [pokemonImage, setCukemonImage] = useState("/MakeResultPage/movingEgg.gif");
  const [mentText, setMentText] = useState("어라...?");
  const eggRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { monsterId } = location.state || {};
  const API_URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("jwt");

  useEffect(() => {
    const delayAndFetch = () => {
      setTimeout(async () => {
        if (!monsterId || !token) return;

        try {
          const response = await fetch(`${API_URL}/monster/${monsterId}/info`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json();
          console.log(data.image);

          if (data.image) {
            setCukemonImage(`data:image/png;base64,${data.image}`);
            setMentText("처음보는 포켓몬이 나타났다!");
          } else {
            throw new Error("이미지 없음");
          }
        } catch (error) {
          console.error("이미지 로드 실패:", error);
          setCukemonImage("");
          setMentText("커켓몬이 도망쳤다.(다시 시도하려면 클릭)");
        }
      }, 15000); 
    };

    delayAndFetch();
  }, [monsterId, API_URL, token]);

  const handleTextClick = () => {
    if (!token) {
      alert("토큰이 없습니다.");
      return;
    }
    navigate(`/make?token=${token}`);
  };

  return (
    <div className="resultPage">
      {pokemonImage && (
        <img
          id="egg"
          ref={eggRef}
          src={pokemonImage}
          alt="cukemonImage"
          className="blinkEffect"
        />
      )}
      <div className="chatBox">
        <p
          id="ment"
          onClick={mentText.includes("도망") ? handleTextClick : undefined}
          style={{ cursor: mentText.includes("도망") ? "pointer" : "default" }}
        >
          {mentText}
        </p>
      </div>
    </div>
  );
}

export default MakeResult;
