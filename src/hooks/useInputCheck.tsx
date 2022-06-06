import { useDispatch } from 'react-redux';
import { useSelector } from '../redux/store/store';
import { setIsEmailInputValid } from '../redux/slice/emailInputSlice';
import { setIsPasswordInputValid } from '../redux/slice/passwordInputSlice';
import { useLocation } from "react-router-dom";
import { setNeedValidation } from '../redux/slice/formValidationSlice';
import { useEffect } from 'react';

export const useInputValidation = () => {
  const emailInput = useSelector((state) => state.emailInput.input);
  const passwordInput = useSelector((state) => state.emailInput.input);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => { dispatch(setNeedValidation(false)) }, [dispatch, location])

  const checkEmail = () => {
    // 正規表現を使って調べる
    const mail_regex1: RegExp = new RegExp('(?:[-!#-\'*+/-9=?A-Z^-~]+.?(?:.[-!#-\'*+/-9=?A-Z^-~]+)*|"(?:[!#-[]-~]|\\\\[ -~])*")@[-!#-\'*+/-9=?A-Z^-~]+(?:.[-!#-\'*+/-9=?A-Z^-~]+)*');
    const mail_regex2: RegExp = new RegExp('^[^@]+@[^@]+$');
    // 空欄のときはバリデーションはしない
    if (emailInput !== '') {
      if (!mail_regex1.test(emailInput) || !mail_regex2.test(emailInput)) {
        dispatch(setIsEmailInputValid(false));
      } else {
        dispatch(setIsEmailInputValid(true));
      }
    }
  };

  const checkPassword = () => {
    if (passwordInput === '') {
      dispatch(setIsPasswordInputValid(false));
    }
    else {
      dispatch(setIsPasswordInputValid(true));
    }
  };

  return { checkEmail: checkEmail, checkPassword: checkPassword } as const
}