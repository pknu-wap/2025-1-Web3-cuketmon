import React from "react";
import "./TypeButton.css";
import typeData from "../Type";

function TypeButton({ type1, type2, setType1, setType2 }) {
  const handleClick = (selectedType) => {
    if (!type1 || type1 === selectedType) {
      setType1(type1 === selectedType ? "" : selectedType);
    } else if (!type2 || type2 === selectedType) {
      setType2(type2 === selectedType ? "" : selectedType);
    } else {
      alert("두 가지까지만 선택할 수 있습니다.");
    }
  };

  return (
    <div className="typeButtonContainer">
      {Object.values(typeData).map((type) => {
        const isSelected = type1 === type.korean || type2 === type.korean;
        return (
          <button
            key={type.korean}
            onClick={() => handleClick(type.korean)}
            className={`typeButton ${isSelected ? "selected" : ""}`}
            style={{
              borderColor: type.color,
              backgroundColor: isSelected ? type.color : "white",
              color: isSelected ? "white" : type.color,
            }}
          >
            {type.korean}
          </button>
        );
      })}
    </div>
  );
}

export default TypeButton;
