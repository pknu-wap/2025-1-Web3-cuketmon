import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./MakeResult.css";

function MakeResult() {
  const [cukemonImage, setCukemonImage] = useState("/MakeResultPage/movingEgg.gif");
  const [mentText, setMentText] = useState("어라...?"); 
  const [countdown, setCountdown] = useState(null);
  const eggRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { monsterId, eta } = location.state || {};
  const API_URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("jwt");

  const fetchCukemon = async () => {
    try {
      const response = await fetch(`${API_URL}/api/monster/${monsterId}/info`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.image) {
        setCukemonImage(data.image); // 이미지 로드 후 상태 업데이트
        setMentText("처음보는 포켓몬이 나타났다!");
      }
    } catch (err) {
      console.error("이미지 로드 실패:", err);
    }
  };

 useEffect(() => {
    if (eta == null || !token) return;

    if (eta <= 5) {
      setMentText(`대기시간: ${eta}초`);
         setCountdown(eta);
    } else {
      setMentText(`대기시간: ${eta}초`);
      setCountdown(eta);
    }
  }, [eta, monsterId, token, API_URL, navigate]);

  // 타이머
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setTimeout(() => {
      const next = countdown - 1;
      setCountdown(next);
      setMentText(`대기시간: ${next}초`);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    if (cukemonImage !== "/MakeResultPage/movingEgg.gif") {
      navigate(`/NamePage`, {
        state: {
          monsterId: monsterId,
          image: cukemonImage,
        },
      });
    }
  }, [cukemonImage, monsterId, navigate]);

  useEffect(() => {
    // countdown이 0이 되면 fetchCukemon 호출
    if (countdown === 0) {
      fetchCukemon();
    }
  }, [countdown, monsterId, token, API_URL, navigate]);

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
        <p id="ment">{mentText}</p>
      </div>
    </div>
  );
}

export default MakeResult;
