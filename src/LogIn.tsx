import { FC, ReactElement, useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";

type LoginInputType = {
  email: string,
  password: string
}

function LogIn(): ReactElement {
  const [userInput, setUserInput] = useState<LoginInputType>({email: '', password: ''});
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<boolean>(false);
  const [resStatus, setResStatus] = useState<number>(200);

  const emailRef = useRef<HTMLInputElement>(null!);
  const passwordRef = useRef<HTMLInputElement>(null!);
  const loginRef = useRef<HTMLButtonElement>(null!);

  let passwordWarning: ReactElement;
  let ErrorAlert: ReactElement;

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
      setIsFormValid(true)
    }
    else {
      setIsFormValid(false);
    }
  }

  async function login(): Promise<void> {
    const userInfo: object = {
      "email": userInput.email,
      "password": userInput.password,
    }

    const url = (await fetch("https://api-for-missions-and-railways.herokuapp.com/signin"
    , {method: 'POST', body: JSON.stringify(userInfo)}
    ).then(res => {
      return res.json();
    })
    )
    if (await url.token) {
      setResStatus(200);
      setLoginError(false);
      console.log(await url.token)
    } else {
      if (await url.ErrorCode) {
        if (await url.ErrorCode === 400) {
          console.log(await url.ErrorMessageJP)
          setResStatus(400);
          setLoginError(true);
        }
        else if (await url.ErrorCode === 403) {
          console.log(await url.ErrorMessageJP)
          setResStatus(403);
          setLoginError(true);
        }
        else if (await url.ErrorCode === 500) {
          console.log(await url.ErrorMessageJP)
          setResStatus(500);
          setLoginError(true);
        }
      }
    }
  }

  // エラーが起きたときコンポーネントが再レンダーされるのでエラーメッセージを出す
  if (loginError) {
    if (resStatus === 403) {
      ErrorAlert = (
        <div id="submit-error" className="alert alert-danger" role="alert">パスワードが正しくありません</div>
      )
    }
    else if (resStatus === 400 || resStatus === 500) {
      ErrorAlert = (
        <div id="submit-error" className="alert alert-danger" role="alert">エラーが起きました。もう一度お試しください</div>
      )
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
      <h2>Log In Page</h2>
      <div className="form" id="signup-form">
        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input type="email" className="form-control" aria-describedby="emailHelp" ref={emailRef} onChange={()=>{checkInput()}}/>
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" ref={passwordRef} onChange={()=>{checkInput()}}/>
          {passwordWarning!}
        </div>
        <button className="btn btn-primary" onClick={()=>{login()}} ref={loginRef}>ログイン</button>
        {ErrorAlert!}
      </div>
      <nav>
        <Link to="/">Home</Link>
      </nav>
      <nav>
        <Link to="/about">About</Link>
      </nav>
      <nav>
        <Link to="/signup">SignUp</Link>
      </nav>
    </>
  )
}

export default LogIn