import React, { useEffect, useState } from "react";
import "./HpBar.css";

const HpBar = ({ name, currentHp, maxHp, type1 = [] }) => {
  const [displayedHp, setDisplayedHp] = useState(Math.min(currentHp, maxHp));

  useEffect(() => {
    const step = () => {
      setDisplayedHp((prevHp) => {
        const targetHp = Math.min(currentHp, maxHp);
        if (prevHp === targetHp) return prevHp;

        const delta = Math.ceil(Math.abs(prevHp - targetHp) / 10);
        return prevHp > targetHp
          ? Math.max(prevHp - delta, targetHp)
          : Math.min(prevHp + delta, targetHp);
      });
    };

    const interval = setInterval(step, 30);
    return () => clearInterval(interval);
  }, [currentHp, maxHp]);

  const clampedDisplayedHp = Math.min(displayedHp, maxHp);
  const hpPercent = (clampedDisplayedHp / maxHp) * 100;

  let barColor = "#39E300";
  if (hpPercent <= 50 && hpPercent > 20) {
    barColor = "#FFD700";
  } else if (hpPercent <= 20) {
    barColor = "#FF4500";
  }

  return (
    <div className="hpBarContainer">
      {name && (
        <div className="hpName">
          {name}
          {type1.length > 0 && (
            <span className="monsterType">
              ({type1.join(", ")})
            </span>
          )}
        </div>
      )}
      <div className="hpBarOuter">
        <div
          className="hpBarInner"
          style={{ width: `${hpPercent}%`, backgroundColor: barColor }}
        ></div>
      </div>
      <div className="hpText">
        {clampedDisplayedHp} / {maxHp}
      </div>
    </div>
  );
};

export default HpBar;
