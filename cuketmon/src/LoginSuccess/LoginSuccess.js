import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function LoginSuccess() {
  const navigate = useNavigate();
   const { token: contextToken, setToken } = useAuth();
  const token = contextToken || localStorage.getItem('accessToken');


  useEffect(() => {

      localStorage.setItem('accessToken', token);
    if (token) {
      setToken(token);

      navigate('/make', { replace: true });
    } else {
      console.error('❌ token 파라미터 없음');
    }
  }, [navigate, setToken,token]);


  /*승오가 고칠거 ^^*/
  return <div>로딩 중...</div>;
}

export default LoginSuccess;
