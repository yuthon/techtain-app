import { ReactElement, useEffect, useRef, useState } from 'react';

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
      console.log(await url.token)
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
      <h2>Sign Up Page</h2>
      <div className="form" id="signup-form">
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input type="name" className="form-control" aria-describedby="emailHelp" ref={nameRef} onChange={()=>{checkInput()}}/>
        </div>
        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input type="email" className="form-control" aria-describedby="emailHelp" ref={emailRef} onChange={()=>{checkInput()}}/>
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" ref={passwordRef} onChange={()=>{checkInput()}}/>
          {passwordWarning!}
        </div>
        <div className="mb-3">
          <label className="form-label">Comfirm Password</label>
          <input type="password" className="form-control" ref={confirmRef} onChange={()=>{checkInput()}}/>
          {passwordWarning!}
        </div>
        <button className="btn btn-primary" onClick={()=>{signup()}} ref={submitRef}>登録</button>
        {ErrorAlert!}
      </div>
    </>
  )
}

export default SignUp;