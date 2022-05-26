import { useContext } from 'react';
import { AuthorizeContext } from '../components/AuthorizeProvider';

export const useAuthorize = () => {
  const { setUserToken, setIsAuthorized } = useContext(AuthorizeContext);

  const authorize = (token: string | undefined) => {
    localStorage.setItem('v_|2Q)iA~*rn%', token!);
    setUserToken(token!);
    setIsAuthorized(true);
  };

  const unAuthorize = () => {
    localStorage.removeItem('v_|2Q)iA~*rn%');
    setUserToken(null);
    setIsAuthorized(false);
  };

  return { authorize: authorize, unAuthorize: unAuthorize } as const;
} 