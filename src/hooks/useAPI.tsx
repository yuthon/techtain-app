import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setIsError } from '../redux/slice/errorSlice';
import { setResStatus } from '../redux/slice/responseSlice';

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

interface paramsType {
  method: string;
  headers?: HeadersInit | undefined;
  body?: BodyInit | null | undefined;
}

export const useAPI = () => {
  // const [response, setResponse] = useState<responseType | null>(null);
  // const response = useSelector((state) => state.response.response);
  const [errorText, setErrorText] = useState<string | null>(null);

  const dispatch = useDispatch();

  const apiCall = async (url: string, params: paramsType): Promise<responseType | null> => {
    return await fetch(
      url,
      params
    ).then(res => {
      if (res.ok) {
        setErrorText(null);
        dispatch(setIsError(false));
        dispatch(setResStatus(res.status));
        if (params.method === 'DELETE') {
          return null;
        }
        else {
          return res.json();
        }
      }
      else {
        dispatch(setResStatus(res.status));
        throw new Error(res.statusText);
      }
    }).catch(error => {
      setErrorText(error);
      dispatch(setIsError(true));
      return null;
    })
  };

  return { errorText: errorText, call: apiCall } as const;
}