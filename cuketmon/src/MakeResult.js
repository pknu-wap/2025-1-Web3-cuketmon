import React, { useEffect, useState, useRef } from "react";
import "./MakeResult.css";

function MakeResult() {
  const [pokemonImage, setPokemonImage] = useState("./MakeResultPage/MovingEgg.gif");
  const eggRef = useRef(null);

  useEffect(() => {
    const eggElement = eggRef.current;

    const handleAnimationEnd = () => {
      fetch("/api/getPokemonImage")
        .then((response) => response.json())
        .then((data) => {
          setPokemonImage(data.imageUrl || "./MakeResultPage/toy.png"); // 백엔드에서 이미지가 없으면 toy.png로 설정
        })
        .catch((error) => {
          console.error("이미지 로드 실패:", error);
          setPokemonImage("./MakeResultPage/toy.png"); // 오류 발생 시 기본 이미지 설정
        });
    };

    eggElement.addEventListener("animationend", handleAnimationEnd);

    return () => {
      eggElement.removeEventListener("animationend", handleAnimationEnd);
    };
  }, []);

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
        <p id="ment">어라...?</p>
      </div>
    </div>
  );
}

export default MakeResult;
