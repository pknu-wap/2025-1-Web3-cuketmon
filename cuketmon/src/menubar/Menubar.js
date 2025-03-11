/*메뉴바*/
import './menubar.css'

const MenuBar = () => {
  return (
    <div className="menubar-items">
      <button className="makePage"><img src='./egg.png'/>커켓몬 만들기</button>
      <button className="battle"><img src='./battleicon.png'/>전투</button>
      <button className="ranking"><img src='./rankingicon.png'/>랭킹</button>
      <button className="mypage"><img src='./mypageicon.png'/>mypage</button>
    </div>
  );
};

export default MenuBar;
