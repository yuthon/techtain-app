import { memo, ReactElement, useEffect, useRef, useState, useContext } from 'react';
import { AuthorizeContext } from './AuthorizeProvider';
import { Link } from "react-router-dom";
import background from './bg_6.jpg';

type LoginInputType = {
  email: string,
  password: string
}

const LogIn = memo((): ReactElement => {
  const [userInput, setUserInput] = useState<LoginInputType>({email: '', password: ''});
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<boolean>(false);
  const [resStatus, setResStatus] = useState<number>(200);

  const emailRef = useRef<HTMLInputElement>(null!);
  const passwordRef = useRef<HTMLInputElement>(null!);
  const loginRef = useRef<HTMLButtonElement>(null!);

  let passwordWarning: ReactElement;
  let ErrorAlert: ReactElement;

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

  const login = async(): Promise<void> => {
    const userInfo: object = {
      "email": userInput.email,
      "password": userInput.password,
    };

    const response = await fetch(
      'https://api-for-missions-and-railways.herokuapp.com/signin',
      {method: 'POST', body: JSON.stringify(userInfo)}
    ).then(res => {
      if (res.ok) {
        setLoginError(false);
        setResStatus(200);
        return res.json();
      }
      else {
        setLoginError(true);
        if (res.status === 400) {
          setResStatus(400);
        }
        else if (res.status === 403) {
          setResStatus(403);
        }
        else {
          setResStatus(500);
        }
      }
    })
    
    if (await response.token) {
      // 認証トークンをローカルストレージに保存
      // あらゆるJavaScriptで書かれたコードから自由にアクセスできてしまうので、念のため項目の名前を不明瞭にし、悪意のあるコードが認証トークンにアクセスしづらくなるようにしておく
      localStorage.setItem('v_|2Q)iA~*rn%', response.token);
      authContext.setUserToken(response.token);
      authContext.setIsAuthorized(true);
    }
  };

  // エラーが起きたときコンポーネントが再レンダーされるのでエラーメッセージを出す
  if (loginError) {
    if (resStatus === 403) {
      ErrorAlert = (
        <div id="submit-error" className="alert alert-danger mt-3 mb-0" role="alert">メールアドレスかパスワードが正しくありません</div>
      );
    }
    else if (resStatus === 400 || resStatus === 500) {
      ErrorAlert = (
        <div id="submit-error" className="alert alert-danger mt-3 mb-0" role="alert">エラーが起きました。もう一度お試しください</div>
      );
    }
  }

  useEffect(()=>{
    // フォームが必要な条件を満たすならボタンを有効化
    if (isFormValid) {
      loginRef.current.disabled = false
    } else {
      loginRef.current.disabled = true
    }
  })

  return (
    <>
      <div className="signupPage-bg" id="loginPage">
        <img className="bg-books fixed-top" src={background} alt="背景"/>
        <div className="container-fuild container-lg">
          <div className="form" id="login-form">
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                aria-describedby="emailHelp"
                ref={emailRef}
                onChange={()=>{checkInput()}}
                placeholder="Eメール"
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                ref={passwordRef}
                onChange={()=>{checkInput()}}
                placeholder="パスワード"
              />
              {passwordWarning!}
            </div>
            <div className="d-flex flex-wrap justify-content-between" id="signupOrLogin">
              <button
                className="btn btn-primary"
                id="btn-register"
                onClick={()=>{login()}}
                ref={loginRef}
              >
                ログイン
              </button>
              <p className="my-auto">または</p>
              <Link className="text-reset" to="/signup">
                <p id="link-login">登録</p>
              </Link>
            </div>
            {ErrorAlert!}
          </div>
        </div>
      </div>
    </>
  )
})

export default LogIn;