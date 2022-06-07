import { useRef } from 'react';
import { useSelector } from '../../redux/store/store';
import { setPasswordConfirmInput } from '../../redux/slice/passwordConfirmInputSlice';
import { useDispatch } from 'react-redux';
import InputFeedback from './InputFeedback';
import { useInputValidation } from '../../hooks/useInputCheck';

const PasswordConfirmInput = () => {
  const passwordConfirmRef = useRef<HTMLInputElement>(null!);
  const isValid = useSelector((state) => state.passwordConfirmInput.isValid);
  const needValidation = useSelector((state) => state.formValidation.needValidation);
  const dispatch = useDispatch();
  const validation = useInputValidation();

  return (
    <div className="mb-3">
      <input
        type="password"
        className={needValidation && !isValid ? 'form-control is-invalid' : 'form-control'}
        ref={passwordConfirmRef}
        onChange={() => { dispatch(setPasswordConfirmInput(passwordConfirmRef.current.value)) }}
        onBlur={() => { validation.checkPasswordConfirm() }}
        placeholder="パスワード（確認用）"
      />
      {needValidation && !isValid ? <InputFeedback text='パスワードが一致しません' /> : null}
    </div>
  )
}

export default PasswordConfirmInput;