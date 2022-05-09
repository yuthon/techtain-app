import { ReactElement, useEffect, useRef, useState, useContext } from 'react';
import { AuthorizeContext } from './AuthorizeProvider';

const EditProfile = (): ReactElement => {
  const [userInput, setUserInput] = useState<string>('');
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<boolean>(false);
  const [resStatus, setResStatus] = useState<number>(200);

  const nameRef = useRef<HTMLInputElement>(null!);
  const btnRef = useRef<HTMLButtonElement>(null!);

  // トークンをコンテキストから取得
  const { userToken } = useContext(AuthorizeContext);

  let ErrorAlert: ReactElement;

  const checkInput = (): void => {
    // ユーザーの入力をstateに反映
    setUserInput(nameRef.current.value);
    // フォームに値が入っているかチェック
    if (
      nameRef.current.value !== ''
    ) {
      setIsFormValid(true)
    }
    else {
      setIsFormValid(false);
    }
  };

  async function update(): Promise<void> {
    const url = await fetch("https://api-for-missions-and-railways.herokuapp.com/users"
    , {method: 'PUT', headers: new Headers({ 'Authorization': `Bearer ${userToken}`}),body: JSON.stringify({"name": userInput})}
    ).then(res => {
      return res.json();
    })
    if (await url.token) {
      setResStatus(200);
      setLoginError(false);
    } else {
      if (await url.ErrorCode) {
        if (await url.ErrorCode === 400) {
          console.log(await url.ErrorMessageJP)
          setResStatus(400);
          setLoginError(true);
        }
        else if (await url.ErrorCode === 403) {
          console.log(await url.ErrorMessageJP)
          setResStatus(401);
          setLoginError(true);
        }
        else if (await url.ErrorCode === 500) {
          console.log(await url.ErrorMessageJP)
          setResStatus(500);
          setLoginError(true);
        }
      }
    }
  };

  // エラーが起きたときコンポーネントが再レンダーされるのでエラーメッセージを出す
  if (loginError) {
    if (resStatus === 401) {
      ErrorAlert = (
        <div id="submit-error" className="alert alert-danger" role="alert">認証エラーが起きました。</div>
      )
    }
    else if (resStatus === 400 || resStatus === 500) {
      ErrorAlert = (
        <div id="submit-error" className="alert alert-danger" role="alert">エラーが起きました。もう一度お試しください</div>
      )
    }
  };

  useEffect(()=>{
    // フォームが必要な条件を満たすならボタンを有効化
    if (isFormValid) {
      btnRef.current.disabled = false
    } else {
      btnRef.current.disabled = true
    }
  })
  
  return (
    <>
      <h2>プロフィールの編集</h2>
      <form className="form" id="signup-form">
        <div className="mb-3">
          <label className="form-label">ユーザ名</label>
          <input type="name" className="form-control" ref={nameRef} onChange={()=>{checkInput()}}/>
        </div>
        <button className="btn btn-primary" onClick={()=>{update()}} ref={btnRef}>変更</button>
        {ErrorAlert!}
      </form>
    </>
  )
}

export default EditProfile;