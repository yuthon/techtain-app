import { createContext, useState } from 'react';

export const AuthorizeContext = createContext();

export function AuthorizeProvider({ children }) {
  let token;
  if (localStorage.getItem('v_|2Q)iA~*rn%')) {
    token = localStorage.getItem('v_|2Q)iA~*rn%');
  }

  const [userToken, setUserToken] = useState(token || '');

  const provider = {
    userToken,
    setUserToken
  }
  return (
    <AuthorizeContext.Provider value={provider}>
      {children}
    </AuthorizeContext.Provider>
  )
}