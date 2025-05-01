import { useEffect } from 'react';
import { useAuth } from './AuthContext';

const TokenInitializer = () => {
  const { setToken } = useAuth();

  useEffect(() => {
    console.log('✅ TokenInitializer 실행됨');
    console.log('✅ window.location.href:', window.location.href);

    const params = new URLSearchParams(window.location.search);
    console.log('✅ window.location.search:', window.location.search);

    const token = params.get('token');
    console.log('✅ token from URL:', token);

    if (token) {
      setToken(token);
      console.log('✅ setToken() 호출 완료');
    } else {
      console.warn('❌ token이 null입니다.');
    }
  }, []);

  return null;
};

export default TokenInitializer;
