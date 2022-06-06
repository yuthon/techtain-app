import { ReactElement } from 'react';
import { useUserAPI } from '../../hooks/useUserAPI';
import { useDispatch } from 'react-redux';
import { setNeedValidation } from '../../redux/slice/formValidationSlice';

const LoginButton = (): ReactElement => {

  const api = useUserAPI();
  const dispatch = useDispatch();

  return (
    <button
      className="btn btn-primary"
      id="btn-register"
      onClick={() => {
        dispatch(setNeedValidation(true));
        api.login();
      }}
    >
      ログイン
    </button>
  )
}

export default LoginButton;