import { useState } from 'react';
import { useSelector } from '../redux/store/store';
import { useDispatch } from 'react-redux';
import { setIsError } from '../redux/slice/errorSlice';
import { setResponse } from '../redux/slice/responseSlice';

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
  // const [isError, setIsError] = useState<boolean>(false);
  const isError = useSelector((state) => state.error.isError);
  const [resStatus, setResStatus] = useState<number | null>(null);
  // const [response, setResponse] = useState<responseType | null>(null);
  const response = useSelector((state) => state.response.response);
  const [errorText, setErrorText] = useState<string | null>(null);

  const dispatch = useDispatch();

  const apiCall = async (url: string, params: paramsType): Promise<void> => {
    const call: responseType = await fetch(
      url,
      params
    ).then(res => {
      if (res.ok) {
        setErrorText(null);
        dispatch(setIsError(false));
        setResStatus(res.status);
        if (params.method === 'DELETE') {
          return null;
        }
        else {
          return res.json();
        }
      }
      else {
        dispatch(setIsError(true));
        setResStatus(res.status);
        throw new Error(res.statusText);
      }
    }).catch(error => {
      setErrorText(error);
    })

    if (call) {
      dispatch(setResponse(call));
    } else {
      dispatch(setResponse(null));
    }
  };

  console.log(response)

  return { isError: isError, response: response, resStatus: resStatus, errorText: errorText, call: apiCall } as const;
}