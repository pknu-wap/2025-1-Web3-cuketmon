import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(null);

  const setToken = (newToken) => {
    setTokenState(newToken);
    localStorage.setItem('accesToken', newToken);
  };

  useEffect(() => {
    const stored = localStorage.getItem('accessToken');
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
