import { useNavigate } from 'react-router-dom';
import './Menubar.css';

const MenuBar = ({ centered }) => {
  const navigate = useNavigate();

  return (
    <div className={`menubarItems ${centered ? 'centered' : ''}`}>
      <button className="makePageLink" onClick={() => navigate('/make')} />
      <button className="battleLink" onClick={() => navigate('/PickScreen')} />
      <button className="rankingLink" onClick={() => navigate('/ranking')} />
      <button className="myPageLink" onClick={() => navigate('/mypage')} />
    </div>
  );
};

export default MenuBar;
