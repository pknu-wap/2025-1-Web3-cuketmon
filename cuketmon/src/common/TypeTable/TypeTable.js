import React from 'react';
import typeData from "../../Type.js";
import "./TypeTable.css";

function TypeTable({ type1, type2 }) {
  const type1Key = type1 ? Object.keys(typeData).find(key => typeData[key].korean === type1) : null;
  const type2Key = type2 ? Object.keys(typeData).find(key => typeData[key].korean === type2) : null;

  const type1Data = type1Key ? typeData[type1Key] : null;
  const type2Data = type2Key ? typeData[type2Key] : null;

  if (!type1Data) {
    return (
      <div className={"typeTable1"}>
        <h1>타입 계산기</h1>
        <img src="/MakePage/type.webp" alt="type" className={"typeImage"} />
      </div>
    );
  }
  
  if(!type1Data){
     return(   
     <div className={"typeTable2"}>
        <p>타입 1을 선택해주세요.</p>
      </div>
    );
  }

  const defenseMap = (type) => ({
    double: new Set(type.double_damage_from),
    half: new Set(type.half_damage_from),
    no: new Set(type.no_damage_from),
  });

  const type1Defense = defenseMap(type1Data);
  const type2Defense = type2Data ? defenseMap(type2Data) : { double: new Set(), half: new Set(), no: new Set() };

  const allTypes = Object.keys(typeData);

  let veryEffective = [];
  let effective = [];
  let notEffective = [];
  let noEffect = [];

  allTypes.forEach(t => {
    if (type1Defense.no.has(t) || type2Defense.no.has(t)) {
      noEffect.push(t);
      return;
    }

    const t1Double = type1Defense.double.has(t);
    const t2Double = type2Defense.double.has(t);
    const t1Half = type1Defense.half.has(t);
    const t2Half = type2Defense.half.has(t);

    if (t1Double && t2Double) {
      veryEffective.push(t);
    } else if ((t1Double && !t2Half) || (!t1Half && t2Double)) {
      effective.push(t);
    } else if ((t1Half && !t2Double) || (!t1Double && t2Half)) {
      notEffective.push(t);
    }
  });

  const getColorText = (types) =>
    types.map(t => (
        <span
        key={t}
        style={{ color: typeData[t].color, marginRight: "10px" }}
        >
        {typeData[t].korean}
        </span>
    ));

  const renderAttack = (type) => (
    <>
        <h3>
        <span style={{ color: type.color }}>{type.korean}</span>{' '}
        <span className={"attackTitle"}>공격 상성</span>
        </h3>
      {type.double_damage_to.length > 0 && (
        <p className={"effectStrong"} >
          효과가 굉장함 : {getColorText(type.double_damage_to)}
        </p>
      )}
      {type.half_damage_to.length > 0 && (
        <p className={"effectWeak"}>
          효과가 별로 : {getColorText(type.half_damage_to)}
        </p>
      )}
      {type.no_damage_to.length > 0 && (
        <p className={"effectNone"}>
          효과가 없음 : {getColorText(type.no_damage_to)}
        </p>
      )}
    </>
  );

  return (
    <div className={"typeTable"}>
        <h1>타입 계산기</h1>

      <img src="/MakePage/type.webp" alt="type" className={"typeImage"} />

      <h3 className={"defenseTitle"}>
        <span style={{ color: type1Data.color }}>{type1Data.korean}</span>
        {type2Data && (
          <>
            {' & '}
            <span style={{ color: type2Data.color }}>{type2Data.korean}</span>
          </>
        )}
        {' '}방어 상성
      </h3>

      {veryEffective.length > 0 && (
        <p className={"effectVeryStrong"}>
          효과가 매우 굉장함 : {getColorText(veryEffective)}
        </p>
      )}
      {effective.length > 0 && (
        <p className={"effectStrong"}>
          효과가 굉장함 : {getColorText(effective)}
        </p>
      )}
      {notEffective.length > 0 && (
        <p className={"effectWeak"}>
          효과가 별로 : {getColorText(notEffective)}
        </p>
      )}
      {noEffect.length > 0 && (
        <p className={"effectNone"}>
          효과가 없음 : {getColorText(noEffect)}
        </p>
      )}

      <br />
      {renderAttack(type1Data)}
      <br />
      {type2Data && renderAttack(type2Data)}
    </div>
  );
}

export default TypeTable;
