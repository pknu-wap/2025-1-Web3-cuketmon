/*로그인 상태 관련 */
import React, { createContext, useRef,useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
const API_URL = process.env.REACT_APP_API_URL;
const AuthContext = createContext();

 export const AuthProvider = ({ children }) => {
   const [token, setTokenState] = useState(null);
   const refreshTimeoutRef = useRef(null);

   /* 엑세스 토큰*/
   const setToken = (newToken) => {
     setTokenState(newToken);
     localStorage.setItem('accessToken', newToken);
   };

   useEffect(() => {
     const stored = localStorage.getItem('accessToken');
     if (stored) {
       setTokenState(stored);
     }
   }, []);

    /* access토큰 만료 1분 전 자동 갱신(5/23 수정)*/
   useEffect(() => {
     if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
     if (!token) return;

     try {
       const { exp } = jwtDecode(token);
       const expiresAt = exp > 1e12 ? exp : exp * 1000; 
       const now = Date.now();
       const refreshIn = expiresAt - now - 60 * 1000;


         console.log('토큰 만료 시각:', new Date(expiresAt));
        console.log('현재 시각:', new Date(now));
         console.log('refreshIn(ms):', refreshIn);
       if (refreshIn > 0) {
         refreshTimeoutRef.current = setTimeout(refreshAccessToken, refreshIn);
       } else {
         refreshAccessToken(); //이미 만료된 상태면 뱌로 갱신
       }
     } catch (e) {
       console.error('refreshToken 갱신 오류', e);
     }

     return () => {
       if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
     };
  },  [token]);

   /* refreshToken 으로 accessToken 갱신*/
   const refreshAccessToken = async () => {
     const res = await fetch(`${API_URL}/api/auth/refresh`, {
       method: 'POST',
       credentials: 'include',
     });
     console.log('refresh 요청 상태:', res.status);

     if (!res.ok)throw new Error('refreshToken 에러');
     const newToken = await res.text();
     setToken(newToken);
     return newToken;
   };

   

  return (
    <AuthContext.Provider value={{ token, setToken}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
