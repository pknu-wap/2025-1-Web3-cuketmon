import { Link } from 'react-router-dom';
import './menubar.css';

const MenuBar = () => {
  return (
    <div className="menubar-items">
      <button className="makePage">
        <img src='/egg.png' alt="egg" />
        <Link to="/Make">커켓몬 만들기</Link>
      </button>
      <button className="battle">
        <img src='/battleicon.png' alt="battle" />
        <Link to="/battle">전투</Link>
      </button>
      <button className="ranking">
        <img src='/rankingicon.png' alt="ranking" />
        <Link to="/ranking">랭킹</Link>
      </button>
      <button className="mypage">
        <img src='/mypageicon.png' alt="mypage" />
        <Link to="/mypage">mypage</Link>
      </button>
    </div>
  );
};

export default MenuBar;
