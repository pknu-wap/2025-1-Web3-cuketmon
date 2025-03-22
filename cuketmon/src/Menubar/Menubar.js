import { Link } from 'react-router-dom';
import './Menubar.css';

const MenuBar = () => {
  return (
    <div className="menubarItems">
      <button className="makePageLink">
        <img src='/Menubar/egg.png' alt="egg" />
        <Link to="/Make">커켓몬 만들기</Link>
      </button>
      <button className="battleLink">
        <img src='/Menubar/battleicon.png' alt="battle" />
        <Link to="/battle">전투</Link>
      </button>
      <button className="rankingLink">
        <img src='/Menubar/rankingicon.png' alt="ranking" />
        <Link to="/ranking">랭킹</Link>
      </button>
      <button className="myPageLink">
        <img src='/Menubar/mypageicon.png' alt="myPage" />
        <Link to="/mypage">mypage</Link>
      </button>
    </div>
  );
};

export default MenuBar;
