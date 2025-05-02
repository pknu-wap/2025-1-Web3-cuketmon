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
  const token = localStorage.getItem('jwt');

  useEffect(() => {
    const fetchPokemonInfo = async () => {
      if (!monsterId) return;
  
      try {
        const response = await fetch(`${API_URL}/monster/${monsterId}/info`, {
          method: "GET", 
          headers:{
             "Authorization": `Bearer ${token}`
          }
        });
        const data = await response.json();
        console.log(data.image);
        setCukemonImage(`data:image/png;base64,${data.image}`);
        setMentText("처음보는 포켓몬이 나타났다!");
      } catch (error) {
        console.error("이미지 로드 실패:", error);
        setCukemonImage("");
        setMentText("커켓몬이 도망쳤다.(다시 시도하려면 클릭)");
      }
    };
  
    fetchPokemonInfo(); 
  }, [monsterId, API_URL]);

  const handleTextClick = () => {
    navigate(`/make?token=${token}`);
    if (!token) {
      alert("토큰이 없습니다.");
      return;
    }
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
