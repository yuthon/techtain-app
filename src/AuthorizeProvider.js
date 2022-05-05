import { createContext, useState } from 'react';

export const AuthorizeContext = createContext();

export function AuthorizeProvider({ children }) {
  let token;
  let auth;
  if (localStorage.getItem('v_|2Q)iA~*rn%')) {
    token = localStorage.getItem('v_|2Q)iA~*rn%');
    auth = true;
  }
  

  const [userToken, setUserToken] = useState(token || '');
  const [isAuthorized, setIsAuthorized] = useState(auth || false);

  const provider = {
    userToken,
    setUserToken,
    isAuthorized,
    setIsAuthorized,
  }
  return (
    <AuthorizeContext.Provider value={provider}>
      {children}
    </AuthorizeContext.Provider>
  )
}