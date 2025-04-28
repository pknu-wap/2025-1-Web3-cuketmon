import { useNavigate } from 'react-router-dom';
import './Menubar.css';

const MenuBar = () => {
  const navigate = useNavigate(); 

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="menubarItems">
      <button className="makePageLink" onClick={() => handleNavigation('/Make')}>
        <img src='/Menubar/egg.png' alt="egg" />
        커켓몬 만들기
      </button>
      <button className="battleLink" onClick={() => handleNavigation('/battle')}>
        <img src='/Menubar/battleicon.png' alt="battle" />
        전투
      </button>
      <button className="rankingLink" onClick={() => handleNavigation('/ranking')}>
        <img src='/Menubar/rankingicon.png' alt="ranking" />
        랭킹
      </button>
      <button className="myPageLink" onClick={() => handleNavigation('/mypage')}>
        <img src='/Menubar/mypageicon.png' alt="myPage" />
        마이페이지
      </button>
    </div>
  );
};

export default MenuBar;
