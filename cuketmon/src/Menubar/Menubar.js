import { useNavigate } from 'react-router-dom';
import './Menubar.css';

const MenuBar = () => {
  const navigate = useNavigate();

  return (
    <div className="menubarItems">
      <button className="makePageLink" onClick={() => navigate('/make')}>
        <img src="/Menubar/egg.webp" alt="egg" />
        커켓몬 만들기
      </button>
      <button className="battleLink" onClick={() => navigate('/PickScreen')}>
        <img src="/Menubar/battleicon.webp" alt="battle" />
        전투
      </button>
      <button className="rankingLink" onClick={() => navigate('/ranking')}>
        <img src="/Menubar/rankingicon.webp" alt="ranking" />
        랭킹
      </button>
      <button className="myPageLink" onClick={() => navigate('/mypage')}>
        <img src="/Menubar/mypageicon.webp" alt="myPage" />
        마이페이지
      </button>
    </div>
  );
};

export default MenuBar;
