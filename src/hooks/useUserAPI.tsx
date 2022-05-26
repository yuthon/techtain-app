import { useState, useContext } from 'react';
import { useAPI } from './useAPI';
import { AuthorizeContext } from '../components/AuthorizeProvider';
import { useAuthorize } from './useAuthorize'

interface responseType {
  token?: string;
  name?: string;
  id?: string;
  title?: string;
  url?: string;
  detail?: string;
  review?: string;
  reviewer?: string;
  isMine?: boolean;
  Error?: string;
}

interface userInputType {
  userName?: string;
  email: string;
  password: string;
}

export const useUserAPI = () => {
  const api = useAPI();
  const url = 'https://api-for-missions-and-railways.herokuapp.com/users';
  const authContext = useContext(AuthorizeContext);
  const authAction = useAuthorize();

  const login = async (userInput: object) => {
    await api.call(
      'https://api-for-missions-and-railways.herokuapp.com/signin',
      { method: 'POST', body: JSON.stringify(userInput) }
    )
    if (!api.isError) {
      authAction.authorize(api.response!.token);
    }
    else {
      authAction.unAuthorize();
    }
  };

  const signup = async (userInput: object) => {
    await api.call(
      url,
      { method: 'POST', body: JSON.stringify(userInput) }
    )
    console.log(api.response)
    if (!api.isError) {
      authAction.authorize(api.response!.token);
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

  return { isError: api.isError, response: api.response, resStatus: api.resStatus, loginAPI: login, signup: signup, getUser: getUser, updateUserAPI: updateUser } as const;
}