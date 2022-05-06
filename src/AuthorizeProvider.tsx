import { FC, ReactElement, createContext, useState } from 'react';

type AuthorizeContextType = {
  userToken: string,
  setUserToken: React.Dispatch<React.SetStateAction<string>>,
  isAuthorized: boolean,
  setIsAuthorized: React.Dispatch<React.SetStateAction<boolean>>,
}

type AuthorizeContextProps = {
  children: ReactElement
}

export const AuthorizeContext = createContext<AuthorizeContextType>(null!);

const AuthorizeProvider: FC<AuthorizeContextProps> = ({ children }): any => {
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

export default AuthorizeProvider;