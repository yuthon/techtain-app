import { useRef } from 'react';
import { useSelector } from '../../redux/store/store';
import { setEmailInput } from '../../redux/slice/emailInputSlice';
import { setIsEmailInputValid } from '../../redux/slice/emailInputSlice';
import { useDispatch } from 'react-redux';
import InputFeedback from '../InputFeedback';

const EmailInput = () => {
  const emailRef = useRef<HTMLInputElement>(null!);
  const isValid = useSelector((state) => state.emailInput.isValid);
  const dispatch = useDispatch();

  const checkEmail = (): void => {
    // console.log("hi")
    // 正規表現を使って調べる
    const mail_regex1: RegExp = new RegExp('(?:[-!#-\'*+/-9=?A-Z^-~]+.?(?:.[-!#-\'*+/-9=?A-Z^-~]+)*|"(?:[!#-[]-~]|\\\\[ -~])*")@[-!#-\'*+/-9=?A-Z^-~]+(?:.[-!#-\'*+/-9=?A-Z^-~]+)*');
    const mail_regex2: RegExp = new RegExp('^[^@]+@[^@]+$');
    // 空欄のときはバリデーションはしない
    if (emailRef.current.value !== '') {
      if (!mail_regex1.test(emailRef.current.value) || !mail_regex2.test(emailRef.current.value)) {
        dispatch(setIsEmailInputValid(false));
      } else {
        dispatch(setIsEmailInputValid(true));
      }
    }
  };

  return (
    <>
      <input
        type="email"
        className={isValid ? 'form-control' : 'form-control is-invalid'}
        aria-describedby="emailHelp"
        ref={emailRef}
        onChange={() => { dispatch(setEmailInput(emailRef.current.value)) }}
        onBlur={() => { checkEmail() }}
        placeholder="Eメール"
      />
      {isValid ? null : <InputFeedback text='有効なメールアドレスを入力してください。（例 example@mail.com など' />}
    </>
  )
}

export default EmailInput;