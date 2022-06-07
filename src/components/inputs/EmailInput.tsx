import { useRef } from 'react';
import { useSelector } from '../../redux/store/store';
import { setEmailInput } from '../../redux/slice/emailInputSlice';
import { useDispatch } from 'react-redux';
import InputFeedback from './InputFeedback';
import { useInputValidation } from '../../hooks/useInputCheck';

const EmailInput = () => {
  const emailRef = useRef<HTMLInputElement>(null!);
  const isValid = useSelector((state) => state.emailInput.isValid);
  const needValidation = useSelector((state) => state.formValidation.needValidation);
  const dispatch = useDispatch();
  const validation = useInputValidation();

  return (
    <div className="mb-3">
      <input
        type="email"
        className={needValidation && !isValid ? 'form-control is-invalid' : 'form-control'}
        ref={emailRef}
        onChange={() => { dispatch(setEmailInput(emailRef.current.value)) }}
        onBlur={() => { validation.checkEmail() }}
        placeholder="Eメール"
      />
      {needValidation && !isValid ? <InputFeedback text='有効なメールアドレスを入力してください。（例 example@mail.com など' /> : null}
    </div>
  )
}

export default EmailInput;