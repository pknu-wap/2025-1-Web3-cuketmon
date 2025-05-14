import { useEffect } from 'react';
import { useAuth } from './AuthContext';

const TokenInitializer = () => {
  const { setToken } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      setToken(token);
      const urlWithoutToken = window.location.href.split('?')[0]; 
      window.history.replaceState({}, document.title, urlWithoutToken);
    } 
  }, []);

  return null;
};

export default TokenInitializer;
