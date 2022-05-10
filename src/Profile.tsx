import { ReactElement, useEffect, useState, useContext, useRef } from 'react';
import { AuthorizeContext } from './AuthorizeProvider';
import MyReviews from './MyReviews';

type userDataType = {
  name: string
}

function Profile (): ReactElement {
  const [userName, setUserName] = useState<string>('')
  const [userInput, setUserInput] = useState<string>('');
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  // トークンをコンテキストから取得
  const { userToken } = useContext(AuthorizeContext);

  const nameRef = useRef<HTMLInputElement>(null!);
  const btnRef = useRef<HTMLButtonElement>(null!);

  // 認証トークンを利用してユーザ情報を取得
  async function getUser(): Promise<void> {
    const userInfo: userDataType = await fetch(`https://api-for-missions-and-railways.herokuapp.com/users`,
    {headers: new Headers({ 'Authorization': `Bearer ${userToken}`})}
    ).then(res => {
      return res.json();
    })
    setUserName(userInfo.name)
  };

  async function update(): Promise<void> {
    const url = await fetch("https://api-for-missions-and-railways.herokuapp.com/users"
    , {method: 'PUT', headers: new Headers({ 'Authorization': `Bearer ${userToken}`}),body: JSON.stringify({"name": userInput})}
    ).then(res => {
      return res.json();
    })
    if (await url.token) {
    } else {
      if (await url.ErrorCode) {
        if (await url.ErrorCode === 400) {
          console.log(await url.ErrorMessageJP)
        }
        else if (await url.ErrorCode === 403) {
          console.log(await url.ErrorMessageJP)
        }
        else if (await url.ErrorCode === 500) {
          console.log(await url.ErrorMessageJP)
        }
      }
    }
  };

  let ErrorAlert: ReactElement;

  useEffect(()=>{
    getUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  useEffect(()=>{
    // フォームが必要な条件を満たすならボタンを有効化
    if (isFormValid) {
      btnRef.current.disabled = false
    } else {
      btnRef.current.disabled = true
    }
  })

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

  return (
    <>
      <div className="reviewPage-bg" id="profilePage">
        <div className="container-fuild container-lg">
          <div className="mb-3 bg-light card p-3" id="userProfile">
            <div className="d-flex flex-wrap">
              <div className="d-flex flex-nowrap">
                <svg className="profile-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                {/* <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --> */}
                  <path
                    d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 128c39.77 0 72 32.24 72 72S295.8 272 256 272c-39.76 0-72-32.24-72-72S216.2 128 256 128zM256 448c-52.93 0-100.9-21.53-135.7-56.29C136.5 349.9 176.5 320 224 320h64c47.54 0 87.54 29.88 103.7 71.71C356.9 426.5 308.9 448 256 448z"
                    fill="#adb5bd"
                  />
                </svg>
                <p className="my-auto ms-2 profile-username">{userName}</p>
              </div>
              <div className="my-auto">
                <button type="button" className="btn btn-secondary btn-sm ms-4" data-bs-toggle="collapse" data-bs-target="#profileEditForm" aria-expanded="false" aria-controls="profileEditForm" id="btn-profile-edit">
                  編集
                </button>
              </div>
            </div>
            <div className="collapse" id="profileEditForm">
              <div className="mb-3">
                <p className="pt-3">ユーザー名</p>
                <input type="name" className="form-control" ref={nameRef} onChange={()=>{checkInput()}}/>
              </div>
              <button className="btn btn-primary" onClick={()=>{update()}} ref={btnRef}>
                変更
              </button>
              {ErrorAlert!}
            </div>
          </div>
          {ErrorAlert!}
          <MyReviews />
        </div>
      </div>
    </>
  )
}

export default Profile;