import typeData from "../../Type.js";

function TypeTable({ type1, type2 }) {
  // type1과 type2가 null이면 처리
  const type1Key = type1 ? Object.keys(typeData).find(key => typeData[key].korean === type1) : null;
  const type2Key = type2 ? Object.keys(typeData).find(key => typeData[key].korean === type2) : null;

  const type1Data = type1Key ? typeData[type1Key] : null;
  const type2Data = type2Key ? typeData[type2Key] : null;

  const getTypeDetails = (type) => {
    if (!type) return null;
  
    const getColorText = (damageTypes) => {
      return damageTypes.map(t => (
        <span key={t} style={{ color: typeData[t].color, marginRight: "10px" }}>
          {typeData[t].korean}
        </span>
      ));
    };
  
    return (
      <>
        <h3>{type.korean}</h3>
        <p style={{ color: 'black' }}>방어 상성</p>
        {type.double_damage_from.length > 0 && (
          <p style={{ color: 'black' }}>
            효과가 굉장함 : {getColorText(type.double_damage_from)}
          </p>
        )}
        {type.half_damage_from.length > 0 && (
          <p style={{ color: 'black' }}>
            효과가 별로 : {getColorText(type.half_damage_from)}
          </p>
        )}
        {type.no_damage_from.length > 0 && (
          <p style={{ color: 'black' }}>
            효과가 없음 : {getColorText(type.no_damage_from)}
          </p>
        )}
        <br />
        <p style={{ color: 'black' }}>공격 상성</p>
        {type.double_damage_to.length > 0 && (
          <p style={{ color: 'black' }}>
            효과가 굉장함 : {getColorText(type.double_damage_to)}
          </p>
        )}
        {type.half_damage_to.length > 0 && (
          <p style={{ color: 'black' }}>
            효과가 별로 : {getColorText(type.half_damage_to)}
          </p>
        )}
        {type.no_damage_to.length > 0 && (
          <p style={{ color: 'black' }}>
            효과가 없음 : {getColorText(type.no_damage_to)}
          </p>
        )}
      </>
    );
  };
  

  return (
    <div className="typeTable">
      {type1Data ? (
        <div style={{ color: type1Data.color, padding: '10px', marginBottom: '10px' }}>
          {getTypeDetails(type1Data)}
        </div>
      ) : (
        <p>타입 1을 선택해주세요.</p>
      )}

      {type2Data ? (
        <div style={{ color: type2Data.color, padding: '10px' }}>
          {getTypeDetails(type2Data)}
        </div>
      ) : (
        <p>타입 2를 선택해주세요.</p>
      )}
    </div>
  );
}

export default TypeTable;
