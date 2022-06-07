import { ReactElement } from 'react';
import { useUserAPI } from '../../hooks/useUserAPI';
import { useDispatch } from 'react-redux';
import { setNeedValidation } from '../../redux/slice/formValidationSlice';

const SignupButton = (): ReactElement => {

  const api = useUserAPI();
  const dispatch = useDispatch();

  return (
    <button
      className="btn btn-primary"
      id="btn-register"
      onClick={() => {
        dispatch(setNeedValidation(true));
        api.signup();
      }}
    >
      登録
    </button>
  )
}

export default SignupButton;