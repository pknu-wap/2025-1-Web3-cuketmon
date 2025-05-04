import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./MakeResult.css";

function MakeResult() {
  const [cukemonImage, setCukemonImage] = useState("/MakeResultPage/movingEgg.gif");
  const [mentText, setMentText] = useState("어라...?");
  const [base64Image, setBase64Image] = useState(""); 
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
          const response = await fetch(`${API_URL}/api/monster/${monsterId}/info`, { //수정 예정임(백엔드에서 이미지를 url로 받게!)
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json();
          console.log(data.image);

          if (data.image) {
            const fullImage = `data:image/png;base64,${data.image}`;
            setCukemonImage(fullImage);
            setBase64Image(fullImage);
            setMentText("처음보는 포켓몬이 나타났다!");
            navigate(`/NamePage`, {
              state: {
                monsterId: monsterId,
                image: fullImage,
              },
            });
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
  }, [monsterId, API_URL, token, navigate]);


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
      <div className="chatBox">
        <p
          id="ment"
          onClick={mentText.includes("도망") ? () => navigate("/Make") : undefined}
          style={{ cursor: mentText.includes("도망") ? "pointer" : "default" }}
        >
          {mentText}
        </p>
      </div>
    </div>
  );
}

export default MakeResult;
