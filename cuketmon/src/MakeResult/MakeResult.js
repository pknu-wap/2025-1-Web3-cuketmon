import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom"; 
import "./MakeResult.css";

function MakeResult() {
  const [pokemonImage, setPokemonImage] = useState("./MakeResultPage/movingEgg.gif");
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
          navigate("/namePage");
        })
        .catch((error) => {
          console.error("이미지 로드 실패:", error);
          setPokemonImage(""); 
          setMentText("커켓몬이 도망쳤다.(다시 시도하려면 클릭)");
          navigate("/NamePage"); //잘되는지 확인하려고 넣은거임 ! 나중에 빼야함
          alert(
            "임시코드로 navigate(/NamePage) 넣어둠!! 꼭 나중에 빼야함."
          );

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
