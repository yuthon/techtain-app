import { FC, ReactElement, useEffect, useState, useContext, useRef } from 'react';
import { AuthorizeContext } from '../components/AuthorizeProvider';
import MyReviews from '../components/MyReviews';
import background from './bg_5.jpg'
import { userUpdateError } from '../assets/ErrorMessages';

type ProfileProps = {
  userName: string | null;
  setUserName: React.Dispatch<React.SetStateAction<string | null>>;
  setIsError: React.Dispatch<React.SetStateAction<boolean>>;
}

const Profile: FC<ProfileProps> = ({ userName, setUserName, setIsError }): ReactElement => {
  // プロフィール編集欄に入力された値
  const [userInput, setUserInput] = useState<string>('');
  // フォームが有効かどうか
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  // エラーメッセージ
  const ErrorRef = useRef<HTMLDivElement>(null!);
  // 認証コンテキスト
  const authContext = useContext(AuthorizeContext);
  // 名前の編集欄
  const nameRef = useRef<HTMLInputElement>(null!);

  // プロフィールの更新処理
  const update = async (): Promise<void> => {
    // フォームを値をチェックしてから値を送信するか決める
    if (isFormValid) {
      await fetch(
        'https://api-for-missions-and-railways.herokuapp.com/users',
        {
          method: 'PUT',
          headers: new Headers({ 'Authorization': `Bearer ${authContext.userToken}` }),
          body: JSON.stringify({ "name": userInput })
        }
      ).then(res => {
        if (res.ok) {
          setUserName(userInput);
        }
        else {
          if (res.status === 400) {
            ErrorRef.current.innerHTML = userUpdateError.code400;
            ErrorRef.current.style.display = 'block';
          }
          else if (res.status === 401) {
            localStorage.removeItem('v_|2Q)iA~*rn%');
            authContext.setUserToken(null);
            authContext.setIsAuthorized(false);
            setIsError(true);
          }
          else if (res.status === 500) {
            ErrorRef.current.innerHTML = userUpdateError.code500;
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
    }
    // フォームが必要な条件を満たしていないならメッセージを表示
    else {
      if (nameRef.current.value === '') {
        ErrorRef.current.innerHTML = userUpdateError.noInput;
        ErrorRef.current.style.display = 'block';
      }
    }
  };

  // プロフィール編集欄に初期値を入れる
  useEffect(() => {
    nameRef.current.value = userName!;
  }, [userName])

  const checkInput = (): void => {
    // ユーザーの入力をstateに反映
    setUserInput(nameRef.current.value);
    // フォームに値が入っているかチェック
    if (nameRef.current.value !== '' && nameRef.current.value !== userName) {
      setIsFormValid(true)
    }
    else {
      setIsFormValid(false);
    }
  };

  return (
    <>
      <div id="profilePage">
        <img className="bg-bookshelf fixed-top" src={background} alt="背景" />
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
                <input type="name" className="form-control" ref={nameRef} onChange={() => { checkInput() }} />
              </div>
              <button className="btn btn-primary" onClick={() => { update() }}>
                変更
              </button>
              <div className="errorMessage alert alert-danger mt-3 mb-0" ref={ErrorRef}></div>
            </div>
          </div>
          <h2 className="text-white">あなたが投稿したレビュー</h2>
          <MyReviews setIsError={setIsError} />
        </div>
      </div>
    </>
  )
}

export default Profile;