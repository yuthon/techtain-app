import { ReactElement, useEffect, useRef, useState, useContext } from 'react';
import { Link } from "react-router-dom";
import bookLogo from './bookLogo.svg';
import { AuthorizeContext } from './AuthorizeProvider';

type UserInputType = {
  name: string,
  email: string,
  password: string,
  confirm: string,
}

function SignUp(): ReactElement {

  const [userInput, setUserInput] = useState<UserInputType>({name: '', email: '', password: '', confirm: ''});
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [passwordMatch, setPasswordMatch] = useState<boolean>(true);
  const [submitError, setSubmitError] = useState<boolean>(false);

  const nameRef = useRef<HTMLInputElement>(null!);
  const emailRef = useRef<HTMLInputElement>(null!);
  const passwordRef = useRef<HTMLInputElement>(null!);
  const confirmRef = useRef<HTMLInputElement>(null!);
  const submitRef = useRef<HTMLButtonElement>(null!);

  let passwordWarning: ReactElement;
  let ErrorAlert: ReactElement;

  // 認証コンテキストを使用
  const authContext = useContext(AuthorizeContext);

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
  }

  async function signup(): Promise<void> {
    const userInfo: object = {
      "name": userInput.name,
      "email": userInput.email,
      "password": userInput.password,
    }

    const url = (await fetch("https://api-for-missions-and-railways.herokuapp.com/users"
    , {method: 'POST', body: JSON.stringify(userInfo)}
    ).then(res => {
      return res.json();
    })
    )
    if (await url.token) {
      setSubmitError(false);
      localStorage.setItem('v_|2Q)iA~*rn%', url.token);
      authContext.setUserToken(url.token);
      authContext.setIsAuthorized(true);
    } else {
      if (await url.ErrorCode) {
        if (await url.ErrorCode === 400) {
          console.log(await url.ErrorMessageJP)
          setSubmitError(true);
        }
        else if (await url.ErrorCode === 401) {
          console.log(await url.ErrorMessageJP)
          setSubmitError(true);
        }
        else if (await url.ErrorCode === 500) {
          console.log(await url.ErrorMessageJP)
          setSubmitError(true);
        }
      }
    }
  }

  // コンポーネントのレンダー時にパスワードが確認用と一致するかチェック
  // 一致しないならメッセージを表示
  if (!passwordMatch) {
    passwordWarning = (
      <div id="emailHelp" className="form-text">パスワードが一致しません</div>
    )
  }

  // エラーが起きたときコンポーネントが再レンダーされるのでエラーメッセージを出す
  if (submitError) {
    ErrorAlert = (
      <div id="submit-error" className="alert alert-danger" role="alert">エラーが起きました。もう一度お試しください</div>
    )
  }

  useEffect(()=>{
    // フォームが必要な条件を満たすならボタンを有効化
    if (isFormValid) {
      submitRef.current.disabled = false
    } else {
      submitRef.current.disabled = true
    }
  })
  
  return (
    <>
      <div className="signupPage-bg">
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
                <input type="name" className="form-control" aria-describedby="emailHelp" ref={nameRef} onChange={()=>{checkInput()}} placeholder="ユーザー名" />
              </div>
              <div className="mb-3">
                <input type="email" className="form-control" aria-describedby="emailHelp" ref={emailRef} onChange={()=>{checkInput()}} placeholder="Eメール" />
              </div>
              <div className="mb-3">
                <input type="password" className="form-control" ref={passwordRef} onChange={()=>{checkInput()}} placeholder="パスワード" />
                {passwordWarning!}
              </div>
              <div className="mb-3">
                <input type="password" className="form-control" ref={confirmRef} onChange={()=>{checkInput()}} placeholder="パスワード（確認用）"/>
                {passwordWarning!}
              </div>
              <div className="d-flex flex-wrap justify-content-between" id="signupOrLogin">
                <button className="btn btn-primary" id="btn-register" onClick={()=>{signup()}} ref={submitRef}>登録</button>
                <p className="my-auto">または</p>
                <Link className="text-reset" to="/login">
                  <p id="link-login">ログイン</p>
                </Link>
              </div>
              {ErrorAlert!}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SignUp;