import { memo, FC, ReactElement, useRef, useState, useContext } from 'react';
import { AuthorizeContext } from './AuthorizeProvider';
import { Link } from "react-router-dom";
import background from './bg_6.jpg';
import bookLogo from './bookLogo.svg';
import { loginError } from './ErrorMessages';

type LoginInputType = {
  email: string,
  password: string
}

type responseType = {
  token?: string,
  ErrorCode?: number
}

type LogInProps = {
  setIsError: React.Dispatch<React.SetStateAction<boolean>>
}

const LogIn: FC<LogInProps> = memo(({ setIsError }): ReactElement => {
  // ログインフォームの入力内容
  const [userInput, setUserInput] = useState<LoginInputType>({ email: '', password: '' });
  // フォームが有効かどうか
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  // email入力欄
  const emailRef = useRef<HTMLInputElement>(null!);
  // パスワード入力欄
  const passwordRef = useRef<HTMLInputElement>(null!);
  // パスワード確認用入力欄
  const loginRef = useRef<HTMLButtonElement>(null!);
  //パスワードが確認用と一致しないときの警告 
  let passwordWarning: ReactElement;
  // エラーメッセージ
  const ErrorRef = useRef<HTMLDivElement>(null!);
  // 認証コンテキストを使用
  const authContext = useContext(AuthorizeContext);

  const checkInput = (): void => {
    // ユーザーの入力をstateに反映
    setUserInput({
      email: emailRef.current.value,
      password: passwordRef.current.value,
    });
    // フォームに値が入っているかチェック
    if (
      emailRef.current.value !== '' &&
      passwordRef.current.value !== ''
    ) {
      setIsFormValid(true);
    }
    else {
      setIsFormValid(false);
    }
  };

  // ログイン処理
  const login = async (): Promise<void> => {
    // フォームを値をチェックしてから値を送信するか決める
    if (isFormValid) {
      const userInfo: object = {
        "email": userInput.email,
        "password": userInput.password,
      };
      // API問い合わせ
      const response: responseType = await fetch(
        'https://api-for-missions-and-railways.herokuapp.com/signin',
        { method: 'POST', body: JSON.stringify(userInfo) }
      ).then(res => {
        if (res.ok) {
          return res.json();
        }
        else {
          if (res.status === 400) {
            ErrorRef.current.innerHTML = loginError.code400;
            ErrorRef.current.style.display = 'block';
          }
          else if (res.status === 401) {
            ErrorRef.current.innerHTML = loginError.code401;
            ErrorRef.current.style.display = 'block';
          }
          else if (res.status === 403) {
            ErrorRef.current.innerHTML = loginError.code401;
            ErrorRef.current.style.display = 'block';
          }
          else if (res.status === 500) {
            ErrorRef.current.innerHTML = loginError.code500;
            ErrorRef.current.style.display = 'block';
          }
          else {
            throw new Error(res.statusText);
          }
        }
      }).catch(error => {
        localStorage.removeItem('v_|2Q)iA~*rn%');
        authContext.setUserToken(null);
        authContext.setIsAuthorized(false);
        setIsError(true);
      })

      if (response) {
        // 認証トークンをローカルストレージに保存
        // あらゆるJavaScriptで書かれたコードから自由にアクセスできてしまうので、念のため項目の名前を不明瞭にし、悪意のあるコードが認証トークンにアクセスしづらくなるようにしておく
        localStorage.setItem('v_|2Q)iA~*rn%', response.token!);
        authContext.setUserToken(response.token!);
        authContext.setIsAuthorized(true);
      }
    }
    // フォームが必要な条件を満たしていないならメッセージを表示
    else {
      ErrorRef.current.innerHTML = loginError.formInvalid;
      ErrorRef.current.style.display = 'block';
    }
  };

  return (
    <>
      <div className="signupPage-bg" id="loginPage">
        <img className="bg-books fixed-top" src={background} alt="背景" />
        <div className="container-fuild container-lg">
          <div className="d-flex flex-nowrap justify-content-center mb-5">
            <img src={bookLogo} className="logo-loginPage my-auto" alt="logo" />
            <h1 className="text-white my-auto logoText-loginPage text-nowrap">Book Review</h1>
          </div>
          <div className="form" id="login-form">
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                aria-describedby="emailHelp"
                ref={emailRef}
                onChange={() => { checkInput() }}
                placeholder="Eメール"
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                ref={passwordRef}
                onChange={() => { checkInput() }}
                placeholder="パスワード"
              />
              {passwordWarning!}
            </div>
            <div className="d-flex flex-wrap justify-content-between" id="signupOrLogin">
              <button
                className="btn btn-primary"
                id="btn-register"
                onClick={() => { login() }}
                ref={loginRef}
              >
                ログイン
              </button>
              <p className="my-auto">または</p>
              <Link className="text-reset" to="/signup">
                <p id="link-login">登録</p>
              </Link>
            </div>
            <div id="submit-error" className="errorMessage alert alert-danger mt-3 mb-0" role="alert" ref={ErrorRef}>
            </div>
          </div>
        </div>
      </div>
    </>
  )
})

export default LogIn;