import typeData from "../../Type.js";

function TypeTable({ type1, type2 }) {
  // type1과 type2가 null이면 처리
  const type1Key = type1 ? Object.keys(typeData).find(key => typeData[key].korean === type1) : null;
  const type2Key = type2 ? Object.keys(typeData).find(key => typeData[key].korean === type2) : null;

  // 타입 데이터가 존재하면 값을 가져오고, 없다면 기본값 처리
  const type1Data = type1Key ? typeData[type1Key] : null;
  const type2Data = type2Key ? typeData[type2Key] : null;

  const getTypeDetails = (type) => {
    if (!type) return null;

    const getColorText = (damageTypes) => {
      return damageTypes.length > 0
        ? damageTypes.map(t => (
            <span key={t} style={{ color: typeData[t].color, marginRight: "10px"}}>
              {typeData[t].korean}
            </span>
          ))
        : '없음';
    };

    return (
      <>
        <h3>{type.korean}</h3>
        <p style={{ color: 'black' }}>받는 2배 데미지: {getColorText(type.double_damage_from)}</p>
        <p style={{ color: 'black' }}>주는 2배 데미지: {getColorText(type.double_damage_to)}</p>
        <p style={{ color: 'black' }}>받는 1/2배 데미지: {getColorText(type.half_damage_from)}</p>
        <p style={{ color: 'black' }}>주는 1/2배 데미지: {getColorText(type.half_damage_to)}</p>
        <p style={{ color: 'black' }}>받는 0배 데미지: {getColorText(type.no_damage_from)}</p>
        <p style={{ color: 'black' }}>주는 0배 데미지: {getColorText(type.no_damage_to)}</p>
      </>
    );
  };

  return (
    <div className="typeTable">
      {/* type1이 null이 아닐 경우에만 표시 */}
      {type1Data ? (
        <div style={{ color: type1Data.color, padding: '10px', marginBottom: '10px' }}>
          {getTypeDetails(type1Data)}
        </div>
      ) : (
        <p>타입 1을 선택해주세요.</p>  // type1이 null일 때 표시
      )}

      {/* type2가 null이 아닐 경우에만 표시 */}
      {type2Data ? (
        <div style={{ color: type2Data.color, padding: '10px' }}>
          {getTypeDetails(type2Data)}
        </div>
      ) : (
        <p>타입 2를 선택해주세요.</p>  // type2가 null일 때 표시
      )}
    </div>
  );
}

export default TypeTable;
