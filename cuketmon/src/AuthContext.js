import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(null);

  const setToken = (newToken) => {
    setTokenState(newToken);
    localStorage.setItem('jwt', newToken);
  };

  useEffect(() => {
    const stored = localStorage.getItem('jwt');
    if (stored) {
      setTokenState(stored);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
