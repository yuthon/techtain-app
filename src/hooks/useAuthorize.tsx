import { useDispatch } from 'react-redux';
import { setToken } from '../redux/slice/authorizeSlice';
import { setIsAuthorized } from '../redux/slice/authorizeSlice';

export const useAuthorize = () => {
  const dispatch = useDispatch();

  const authorize = (token: string | undefined) => {
    localStorage.setItem('v_|2Q)iA~*rn%', token!);
    dispatch(setToken(token!));
    dispatch(setIsAuthorized(true));
  };

  const unAuthorize = () => {
    localStorage.removeItem('v_|2Q)iA~*rn%');
    dispatch(setToken(null));
    dispatch(setIsAuthorized(false));
  };

  return { authorize: authorize, unAuthorize: unAuthorize } as const;
} 