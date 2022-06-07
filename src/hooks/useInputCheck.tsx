import { useDispatch } from 'react-redux';
import { useSelector } from '../redux/store/store';
import { setIsEmailInputValid } from '../redux/slice/emailInputSlice';
import { setIsPasswordInputValid } from '../redux/slice/passwordInputSlice';
import { setIsPasswordConfirmInputValid } from '../redux/slice/passwordConfirmInputSlice';
import { setIsUserNameInputValid } from '../redux/slice/userNameInputSlice';
import { useLocation } from "react-router-dom";
import { setNeedValidation } from '../redux/slice/formValidationSlice';
import { useEffect } from 'react';

export const useInputValidation = () => {
  const emailInput = useSelector((state) => state.emailInput.input);
  const passwordInput = useSelector((state) => state.passwordInput.input);
  const passwordConfirmInput = useSelector((state) => state.passwordConfirmInput.input);
  const userNameInput = useSelector((state) => state.userNameInput.input);
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

  const checkUserName = () => {
    if (userNameInput === '') {
      dispatch(setIsUserNameInputValid(false));
    }
    else {
      dispatch(setIsUserNameInputValid(true));
    }
  };

  const checkPasswordConfirm = () => {
    if (passwordConfirmInput === '') {
      if (passwordInput === '') {
        dispatch(setIsPasswordConfirmInputValid(true));
      }
      else {
        dispatch(setIsPasswordConfirmInputValid(false));
      }
    }
    else {
      if (passwordConfirmInput === passwordInput) {
        dispatch(setIsPasswordConfirmInputValid(true));
      }
      else {
        dispatch(setIsPasswordConfirmInputValid(false));
      }
    }
  };

  return { checkEmail: checkEmail, checkPassword: checkPassword, checkUserName: checkUserName, checkPasswordConfirm: checkPasswordConfirm } as const
}