import { useAuth } from '../AuthContext';
import './Menubar.css';

const MenuBar = () => {
  const { token } = useAuth(); 

  const handleNavigation = (path) => {
    const url = new URL(window.location.origin + path);
    if (token) {
      url.searchParams.set('token', token);
    }
    window.location.href = url.toString();
  };

  return (
    <div className="menubarItems">
      <button className="makePageLink" onClick={() => handleNavigation('/make')}>
        <img src="/Menubar/egg.png" alt="egg" />
        커켓몬 만들기
      </button>
      <button className="battleLink" onClick={() => handleNavigation('/battle')}>
        <img src="/Menubar/battleicon.png" alt="battle" />
        전투
      </button>
      <button className="rankingLink" onClick={() => handleNavigation('/ranking')}>
        <img src="/Menubar/rankingicon.png" alt="ranking" />
        랭킹
      </button>
      <button className="myPageLink" onClick={() => handleNavigation('/mypage')}>
        <img src="/Menubar/mypageicon.png" alt="myPage" />
        마이페이지
      </button>
    </div>
  );
};

export default MenuBar;
