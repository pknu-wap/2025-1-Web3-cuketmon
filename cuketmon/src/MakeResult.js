import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom"; 
import "./MakeResult.css";

function MakeResult() {
  const [pokemonImage, setPokemonImage] = useState("./MakeResultPage/MovingEgg.gif");
  const [mentText, setMentText] = useState("어라...?");
  const eggRef = useRef(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const eggElement = eggRef.current;

    const handleAnimationEnd = () => {
      fetch("/api/getPokemonImage")
        .then((response) => response.json())
        .then((data) => {
          setPokemonImage(data.imageUrl);
          setMentText("처음보는 포켓몬이 나타났다!");
        })
        .catch((error) => {
          console.error("이미지 로드 실패:", error);
          setPokemonImage(""); 
          setMentText("커켓몬이 도망쳤다.(다시 시도하려면 클릭)");
        });
    };

    eggElement.addEventListener("animationend", handleAnimationEnd);

    return () => {
      eggElement.removeEventListener("animationend", handleAnimationEnd);
    };
  }, []);

  const handleTextClick = () => {
    navigate("/make");
  };

  return (
    <div className="ResultPage">
      <img
        id="egg"
        ref={eggRef}
        src={pokemonImage}
        alt="CukemonImage"
        className="blinkEffect"
      />
      <div className="chatbox">
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
