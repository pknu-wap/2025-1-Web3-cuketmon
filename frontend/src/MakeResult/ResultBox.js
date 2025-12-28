export default function ResultBox({ children }) {
  return (
    <div className="resultBoxContainer">
      <div className="whiteBox">
        {children}
        <div className="polygonIndicator" />
      </div>
    </div>
  );
}