import { useEffect } from 'react';
import { useAuth } from './AuthContext';

const API_URL = process.env.REACT_APP_API_URL;

const TokenInitializer = () => {
  const { setToken } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      setToken(token);
      const urlWithoutToken = window.location.href.split('?')[0];
      window.history.replaceState({}, document.title, urlWithoutToken);

      fetch(`${API_URL}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include'
      })
        .then(res => {
          if (!res.ok) throw new Error('refreshToken 에러');
          console.log('efreshToken 쿠키 설정 완료');
        })
        .catch(err => {
          console.error('refreshToken 설정 실패:', err);
        });
    }
  }, [setToken]);

  return null;
};

export default TokenInitializer;
