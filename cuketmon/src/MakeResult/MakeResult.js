import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom"; 
import "./MakeResult.css";

function MakeResult() {
  const [pokemonImage, setCukemonImage] = useState("/MakeResultPage/movingEgg.gif"); 
  const [mentText, setMentText] = useState("어라...?");
  const eggRef = useRef(null);
  const navigate = useNavigate(); 
  
  const [monsterId, setMonsterId] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL;
  const location = useLocation(); 
  useEffect(() => {
    const monsterIdFromState = location.state?.monsterId;
    if (monsterIdFromState) {
      setMonsterId(monsterIdFromState);
    }

    if (monsterId) {
      fetch(`${API_URL}/monster/${monsterId}/info`, { method: "GET" })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.Image)
          setCukemonImage(`data:image/png;base64,${data.Image}`); 
          setMentText("처음보는 포켓몬이 나타났다!");
        })
        .catch((error) => {
          console.error("이미지 로드 실패:", error);
          setCukemonImage("");
          setMentText("커켓몬이 도망쳤다.(다시 시도하려면 클릭)");
        });
    }
  }, [monsterId, location, API_URL]);

  const handleTextClick = () => {
    const token = localStorage.getItem('token');
    navigate("/makepage?token="+token);
  };

  return (
    <div className="resultPage">
      <img
        id="egg"
        ref={eggRef}
        src={pokemonImage} 
        alt="cukemonImage"
        className="blinkEffect"
      />
      <div className="chatBox">
        <p 
          id="ment" 
          onClick={mentText.includes("도망") ? handleTextClick : null} 
          style={{ cursor: mentText.includes("도망") ? "pointer" : "default" }} 
        >
          {mentText}
        </p> 
      </div>
    </div>
  );
}

export default MakeResult;
