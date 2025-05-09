import React, { useEffect, useState, useRef } from "react";
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

  useEffect(() => {
    if (eta == null || !token) return;

    const fetchCukemon = async () => {
      try {
        const response = await fetch(`${API_URL}/api/monster/${monsterId}/info`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();

        if (data.image) {
          setCukemonImage(data.image);
          setMentText("처음보는 포켓몬이 나타났다!");
          navigate(`/NamePage`, {
            state: {
              monsterId: monsterId,
              image: data.image,
            },
          });
        }
      } catch (err) {
        console.error("이미지 로드 실패:", err);
      }
    };

    if (eta <= 5) {
      setMentText("어라...?");
      fetchCukemon();
    } else {
      setMentText(`대기시간: ${eta}초`);
      setCountdown(eta);

      const polling = setInterval(() => {
        fetchCukemon();
      }, 1000); //1초마다 커켓몬 이미지 있는지 봄

      return () => clearInterval(polling);
    }
  }, [eta, monsterId, token, API_URL, navigate]);

  // 시간 감소 로직
  useEffect(() => {
    if (countdown == null || countdown <= 0) return;

    const timer = setTimeout(() => {
      const next = countdown - 1;
      setCountdown(next);
      setMentText(`대기시간: ${next}초`);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);


  useEffect(() => {
    if (countdown !== 0) return;

    const fetchFinal = async () => {
      try {
        const response = await fetch(`${API_URL}/api/monster/${monsterId}/info`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();

        if (data.image) {
          setCukemonImage(data.image);
          setMentText("처음보는 포켓몬이 나타났다!");
          navigate(`/NamePage`, {
            state: {
              monsterId: monsterId,
              image: data.image,
            },
          });
        } else {
          throw new Error("이미지 없음");
        }
      } catch (error) {
        console.error("최종 이미지 로드 실패:", error);
        setMentText("커켓몬이 도망쳤다.");
        navigate("/Make");
      }
    };

    fetchFinal();
  }, [countdown, monsterId, token, API_URL]);

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
