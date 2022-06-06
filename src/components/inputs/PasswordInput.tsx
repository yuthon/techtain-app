import { useRef } from 'react';
import { useSelector } from '../../redux/store/store';
import { setPasswordInput } from '../../redux/slice/passwordInputSlice';
import { setIsPasswordInputValid } from '../../redux/slice/passwordInputSlice';
import { useDispatch } from 'react-redux';
import InputFeedback from '../InputFeedback';

const PasswordInput = () => {
  const passwordRef = useRef<HTMLInputElement>(null!);
  const isValid = useSelector((state) => state.passwordInput.isValid);
  const dispatch = useDispatch();

  const checkPassword = () => {
    if (passwordRef.current.value !== '') {
      dispatch(setIsPasswordInputValid(true));
    }
  }

  return (
    <>
      <input
        type="password"
        className={isValid ? 'form-control' : 'form-control is-invalid'}
        ref={passwordRef}
        onChange={() => { dispatch(setPasswordInput(passwordRef.current.value)) }}
        onBlur={() => { checkPassword() }}
        placeholder="パスワード"
      />
      {isValid ? null : <InputFeedback text='パスワードを入力してください' />}
    </>
  )
}

export default PasswordInput;