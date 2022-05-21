import { memo, ReactElement, useRef, useState, useContext } from 'react';
import { Link, useNavigate } from "react-router-dom";
import bookLogo from './bookLogo.svg';
import { AuthorizeContext } from './AuthorizeProvider';
import background from './bg_6.jpg';
import { signupError } from './ErrorMessages';

type UserInputType = {
  name: string,
  email: string,
  password: string,
  confirm: string,
}

type responseType = {
  token?: string,
  ErrorCode?: number
}

const SignUp = memo((): ReactElement => {
  const [userInput, setUserInput] = useState<UserInputType>({ name: '', email: '', password: '', confirm: '' });
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [passwordMatch, setPasswordMatch] = useState<boolean>(true);

  const nameRef = useRef<HTMLInputElement>(null!);
  const emailRef = useRef<HTMLInputElement>(null!);
  const passwordRef = useRef<HTMLInputElement>(null!);
  const confirmRef = useRef<HTMLInputElement>(null!);
  const submitRef = useRef<HTMLButtonElement>(null!);
  // エラーメッセージ
  const ErrorRef = useRef<HTMLDivElement>(null!);
  // パスワード不一致のメッセージ
  const passwordWarningRef = useRef<HTMLDivElement>(null!);
  // メールアドレス無効のメッセージ
  const emailWarningRef = useRef<HTMLDivElement>(null!);
  // 認証コンテキストを使用
  const authContext = useContext(AuthorizeContext);
  // リダイレクト用
  const navigate = useNavigate();

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

  // 登録処理
  const signup = async (): Promise<void> => {
    // フォームを値をチェックしてから値を送信するか決める
    if (isFormValid) {
      const userInfo: object = {
        "name": userInput.name,
        "email": userInput.email,
        "password": userInput.password,
      }
      // API問い合わせ
      const response: responseType = await fetch(
        'https://api-for-missions-and-railways.herokuapp.com/users',
        { method: 'POST', body: JSON.stringify(userInfo) }
      ).then(res => {
        if (res.ok) {
          return res.json();
        }
        else {
          if (res.status === 400) {
            ErrorRef.current.innerHTML = signupError.code400;
            ErrorRef.current.style.display = 'block';
          }
          else if (res.status === 401) {
            ErrorRef.current.innerHTML = signupError.code401;
            ErrorRef.current.style.display = 'block';
          }
          else if (res.status === 403) {
            ErrorRef.current.innerHTML = signupError.code401;
            ErrorRef.current.style.display = 'block';
          }
          else if (res.status === 500) {
            ErrorRef.current.innerHTML = signupError.code500;
            ErrorRef.current.style.display = 'block';
          }
          else {
            throw new Error(res.statusText);
          }
        }
      }).catch(error => {
        navigate('/')
      })

      if (response) {
        localStorage.setItem('v_|2Q)iA~*rn%', response.token!);
        authContext.setUserToken(response.token!);
        authContext.setIsAuthorized(true);
      }
    }
    // フォームが必要な条件を満たしていないならメッセージを表示
    else {
      if (nameRef.current.value === '' || emailRef.current.value === '' || passwordRef.current.value === '') {
        ErrorRef.current.innerHTML = signupError.formInvalid;
        ErrorRef.current.style.display = 'block';
      }
    }
  };

  return (
    <div id="signupPage">
      <img className="bg-books fixed-top" src={background} alt="背景" />
      <div className="container-fuild container-lg" id="signupPage-content">
        <div className="row">
          <div className="col-md-6" id="welcomeMessage">
            <div className="d-flex flex-wrap">
              <div className="d-flex flex-nowrap">
                <img src={bookLogo} className="signupPage-logo" alt="logo" />
                <h1 className="text-start text-white">Book Review</h1>
              </div>
              <h1 className="text-start text-white ms-2">へようこそ！</h1>
            </div>
            <h2 className="text-start text-white mt-5">会員登録してレビューにアクセスしてみましょう！</h2>
          </div>
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
                ref={submitRef}
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
        </div>
      </div>
    </div>
  )
})

export default SignUp;