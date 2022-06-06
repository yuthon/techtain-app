import { useContext } from 'react';
import { useAPI } from './useAPI';
import { AuthorizeContext } from '../components/AuthorizeProvider';
import { useAuthorize } from './useAuthorize'
import { useDispatch } from 'react-redux';
import { useSelector } from '../redux/store/store';
import { setResStatus } from '../redux/slice/responseSlice';

export const useUserAPI = () => {
  const api = useAPI();
  const url = 'https://api-for-missions-and-railways.herokuapp.com/users';
  const authContext = useContext(AuthorizeContext);
  const authAction = useAuthorize();
  const emailState = useSelector((state) => state.emailInput);
  const passwordState = useSelector((state) => state.passwordInput);
  const dispatch = useDispatch();

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

  const signup = async function (userInput: object) {
    const response = await api.call(
      url,
      { method: 'POST', body: JSON.stringify(userInput) }
    )

    if (response) {
      authAction.authorize(response!.token);
    }
    else {
      authAction.unAuthorize();
    }
  };

  const updateUser = (userInput: object) => {
    api.call(
      url,
      {
        method: 'PUT',
        headers: new Headers({ 'Authorization': `Bearer ${authContext.userToken}` }),
        body: JSON.stringify({ "name": userInput })
      }
    )
  };

  const getUser = () => {
    api.call(
      url,
      {
        method: 'GET',
        headers: new Headers({ 'Authorization': `Bearer ${authContext.userToken}` })
      }
    )
  }

  return { login: login, signup: signup, getUser: getUser, updateUserAPI: updateUser } as const;
}