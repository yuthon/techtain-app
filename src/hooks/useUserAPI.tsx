import { useAPI } from './useAPI';
import { useAuthorize } from './useAuthorize'
import { useDispatch } from 'react-redux';
import { useSelector } from '../redux/store/store';
import { setResStatus } from '../redux/slice/responseSlice';
import { setUserName } from '../redux/slice/userSlice';
import { useEffect } from 'react';

export const useUserAPI = () => {
  const api = useAPI();
  const url = 'https://api-for-missions-and-railways.herokuapp.com/users';
  const authAction = useAuthorize();
  const token = useSelector(state => state.authorize.token);
  const userNameState = useSelector(state => state.userNameInput);
  const emailState = useSelector(state => state.emailInput);
  const passwordState = useSelector(state => state.passwordInput);
  const passwordConfirmState = useSelector(state => state.passwordConfirmInput);
  const dispatch = useDispatch();
  const isAuthorized = useSelector(state => state.authorize.isAuthorized);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { getUser() }, [isAuthorized])

  const login = async () => {
    if (emailState.isValid && passwordState.isValid) {
      const response = await api.call(
        'https://api-for-missions-and-railways.herokuapp.com/signin',
        {
          method: 'POST', body: JSON.stringify({
            "email": emailState.input,
            "password": passwordState.input
          })
        }
      )

      if (response) {
        authAction.authorize(response!.token);
      }
      else {
        authAction.unAuthorize();
      }
    }
    else {
      dispatch(setResStatus(null));
    }
  };

  const signup = async () => {
    if (
      emailState.isValid &&
      passwordState.isValid &&
      userNameState.isValid &&
      passwordConfirmState.isValid
    ) {
      const response = await api.call(
        url,
        {
          method: 'POST',
          body: JSON.stringify({
            "name": userNameState.input,
            "email": emailState.input,
            "password": passwordState.input
          }
          )
        }
      )

      if (response) {
        authAction.authorize(response.token);
      }
      else {
        authAction.unAuthorize();
      }
    }
    else {
      dispatch(setResStatus(null));
    }
  };

  const updateUser = (userInput: object) => {
    api.call(
      url,
      {
        method: 'PUT',
        headers: new Headers({ 'Authorization': `Bearer ${token}` }),
        body: JSON.stringify({ "name": userInput })
      }
    )
  };

  const getUser = async () => {
    if (isAuthorized) {
      const response = await api.call(
        url,
        {
          method: 'GET',
          headers: new Headers({ 'Authorization': `Bearer ${token}` })
        }
      )

      if (response) {
        dispatch(setUserName(response.name!));
      }
      else {
        dispatch(setUserName(null));
      }
    }
  };

  return { login: login, signup: signup, getUser: getUser, updateUserAPI: updateUser } as const;
}