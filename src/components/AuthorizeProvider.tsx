import { FC, ReactElement, createContext, useState } from 'react';

type AuthorizeContextType = {
  userToken: string | null,
  setUserToken: React.Dispatch<React.SetStateAction<string | null>>,
  isAuthorized: boolean,
  setIsAuthorized: React.Dispatch<React.SetStateAction<boolean>>,
}

type AuthorizeContextProps = {
  children: ReactElement
}

export const AuthorizeContext = createContext<AuthorizeContextType>(null!);

const AuthorizeProvider: FC<AuthorizeContextProps> = ({ children }): ReactElement => {
  let auth: boolean;
  let token: string | null = localStorage.getItem('v_|2Q)iA~*rn%');

  if (token) {
    auth = true;
  } else {
    auth = false;
  }
  
  const [userToken, setUserToken] = useState<string | null>(token);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(auth);

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