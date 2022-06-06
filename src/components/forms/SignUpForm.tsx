import { memo, ReactElement, useRef, useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { signupError } from '../../utils/ErrorMessages';
import { useUserAPI } from '../../hooks/useUserAPI'
import { useSelector } from '../../redux/store/store';

type UserInputType = {
  name: string,
  email: string,
  password: string,
  confirm: string,
}

const SignUpForm = memo((): ReactElement => {
  // ユーザーの入力
  const [userInput, setUserInput] = useState<UserInputType>({ name: '', email: '', password: '', confirm: '' });
  // フォームのバリデーション
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  // パスワード確認の一致
  const [passwordMatch, setPasswordMatch] = useState<boolean>(true);
  // 名前
  const nameRef = useRef<HTMLInputElement>(null!);
  // Eメール
  const emailRef = useRef<HTMLInputElement>(null!);
  // パスワード
  const passwordRef = useRef<HTMLInputElement>(null!);
  // パスワード確認用
  const confirmRef = useRef<HTMLInputElement>(null!);
  // エラーメッセージ
  const ErrorRef = useRef<HTMLDivElement>(null!);
  // パスワード不一致のメッセージ
  const passwordWarningRef = useRef<HTMLDivElement>(null!);
  // メールアドレス無効のメッセージ
  const emailWarningRef = useRef<HTMLDivElement>(null!);

  const isError = useSelector((state) => state.error.isError);

  const api = useUserAPI();

  const checkInput = (): void => {
    // ユーザーの入力をstateに反映
    setUserInput({
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      confirm: confirmRef.current.value,
    });
    if (passwordRef.current.value !== confirmRef.current.value) {
      setPasswordMatch(false);
    }
    else {
      setPasswordMatch(true);
    }
    // フォームに値が入っているかチェック
    if (
      nameRef.current.value !== '' &&
      emailRef.current.value !== '' &&
      passwordRef.current.value !== ''
    ) {
      // パスワードが確認用と一致するかチェック
      if (passwordRef.current.value === confirmRef.current.value) {
        setIsFormValid(true);
      } else {
        setIsFormValid(false);
      }
    }
    else {
      setIsFormValid(false);
    }
  };

  // パスワード確認欄からフォーカスが外れた時にパスワードの一致をチェック
  const checkPassword = (): void => {
    // 空欄のときはバリデーションはしない
    if (confirmRef.current.value === '' || passwordRef.current.value === '') {
      confirmRef.current.className = 'form-control';
      passwordWarningRef.current.style.display = 'none';
    }
    else {
      if (!passwordMatch && passwordRef.current.value.length > 0) {
        confirmRef.current.className = 'form-control is-invalid';
        passwordWarningRef.current.style.display = 'block';
      } else if (passwordMatch) {
        confirmRef.current.className = 'form-control';
        passwordWarningRef.current.style.display = 'none';
      }
    }
  };

  // Eメール入力欄からフォーカスが外れた時にEメールのバリデーションを行う
  const checkEmail = (): void => {
    // 正規表現を使って調べる
    const mail_regex1: RegExp = new RegExp('(?:[-!#-\'*+/-9=?A-Z^-~]+.?(?:.[-!#-\'*+/-9=?A-Z^-~]+)*|"(?:[!#-[]-~]|\\\\[ -~])*")@[-!#-\'*+/-9=?A-Z^-~]+(?:.[-!#-\'*+/-9=?A-Z^-~]+)*');
    const mail_regex2: RegExp = new RegExp('^[^@]+@[^@]+$');
    // 空欄のときはバリデーションはしない
    if (emailRef.current.value === '') {
      emailRef.current.className = 'form-control';
      emailWarningRef.current.style.display = 'none';
    }
    else {
      if (!mail_regex1.test(emailRef.current.value) || !mail_regex2.test(emailRef.current.value)) {
        emailRef.current.className = 'form-control is-invalid';
        emailWarningRef.current.style.display = 'block';
      } else {
        emailRef.current.className = 'form-control';
        emailWarningRef.current.style.display = 'none';
      }
    }
  };

  const signup = () => {
    if (isFormValid) {
      const userParams = {
        "name": userInput.name,
        "email": userInput.email,
        "password": userInput.password,
      }
      api.signup(userParams);
    }
    else {
      if (nameRef.current.value === '' || emailRef.current.value === '' || passwordRef.current.value === '') {
        ErrorRef.current.innerHTML = signupError.formInvalid;
        ErrorRef.current.style.display = 'block';
      }
    }
  }

  useEffect(() => {

  }, [isError])

  return (
    <div className="form col-md-6" id="signupForm">
      <div className="mb-3">
        <input
          type="name"
          className="form-control"
          ref={nameRef} onChange={() => { checkInput() }}
          placeholder="ユーザー名"
        />
      </div>
      <div className="mb-3">
        <input
          type="email"
          className="form-control"
          aria-describedby="emailHelp"
          ref={emailRef}
          onChange={() => { checkInput() }}
          onBlur={() => { checkEmail() }}
          placeholder="Eメール"
        />
        <div className="errorMessage invalid-feedback mb-0" ref={emailWarningRef}>
          有効なメールアドレスを入力してください。（例 example@mail.com など
        </div>
      </div>
      <div className="mb-3">
        <input
          type="password"
          className="form-control"
          ref={passwordRef}
          onChange={() => { checkInput() }}
          onBlur={() => { checkPassword() }}
          placeholder="パスワード"
        />
      </div>
      <div className="mb-3">
        <input
          type="password"
          className="form-control"
          ref={confirmRef}
          onChange={() => { checkInput() }}
          onBlur={() => { checkPassword() }}
          placeholder="パスワード（確認用）"
        />
        <div className="errorMessage invalid-feedback mb-0" ref={passwordWarningRef}>
          パスワードが一致しません
        </div>
      </div>
      <div className="d-flex flex-wrap justify-content-between" id="signupOrLogin">
        <button
          className="btn btn-primary"
          id="btn-register" onClick={() => { signup() }}
        >
          登録
        </button>
        <p className="my-auto">または</p>
        <Link className="text-reset" to="/login">
          <p id="link-login">ログイン</p>
        </Link>
      </div>
      <div id="submit-error" className="errorMessage alert alert-danger mt-3 mb-0" role="alert" ref={ErrorRef}>
      </div>
    </div>
  )
})

export default SignUpForm;