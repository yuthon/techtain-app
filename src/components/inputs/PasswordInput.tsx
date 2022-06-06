import { useRef } from 'react';
import { useSelector } from '../../redux/store/store';
import { setPasswordInput } from '../../redux/slice/passwordInputSlice';
import { useDispatch } from 'react-redux';
import InputFeedback from '../InputFeedback';
import { useInputValidation } from '../../hooks/useInputCheck';

const PasswordInput = () => {
  const passwordRef = useRef<HTMLInputElement>(null!);
  const isValid = useSelector((state) => state.passwordInput.isValid);
  const needValidation = useSelector((state) => state.formValidation.needValidation);
  const dispatch = useDispatch();
  const validation = useInputValidation();

  return (
    <div className="mb-3">
      <input
        type="password"
        className={needValidation && !isValid ? 'form-control is-invalid' : 'form-control'}
        ref={passwordRef}
        onChange={() => { dispatch(setPasswordInput(passwordRef.current.value)) }}
        onBlur={() => { validation.checkPassword() }}
        placeholder="パスワード"
      />
      {needValidation && !isValid ? <InputFeedback text='パスワードを入力してください' /> : null}
    </div>
  )
}

export default PasswordInput;