import { memo, ReactElement, useContext, useState, useRef } from 'react';
import { AuthorizeContext } from './AuthorizeProvider';
import background from './bg_5.jpg'
import { useNavigate } from "react-router-dom";
import { newReviewError } from './ErrorMessages';

type UserInputType = {
  title: string,
  detail: string,
  url: string,
  text: string
}

const NewReview = memo((): ReactElement => {
  // 認証コンテキスト
  const authContext = useContext(AuthorizeContext);
  // フォームに入力された値
  const [userInput, setUserInput] = useState<UserInputType>({ title: '', detail: '', url: '', text: '' });
  // フォームが有効かどうか
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  // 書籍のタイトル
  const titleRef = useRef<HTMLInputElement>(null!);
  // 書籍の詳細
  const detailRef = useRef<HTMLTextAreaElement>(null!);
  // 書籍のurl
  const urlRef = useRef<HTMLInputElement>(null!);
  // 書籍のレビュー
  const textRef = useRef<HTMLTextAreaElement>(null!);
  // 投稿ボタン
  const btnRef = useRef<HTMLButtonElement>(null!);
  // リダイレクト用
  const navigate = useNavigate();
  // エラーメッセージ
  const ErrorRef = useRef<HTMLDivElement>(null!);

  // 投稿処理
  const submit = async (): Promise<void> => {
    // フォームを値をチェックしてから値を送信するか決める
    if (isFormValid) {
      // API問い合わせ
      await fetch(
        "https://api-for-missions-and-railways.herokuapp.com/books",
        {
          method: 'POST',
          headers: new Headers({ 'Authorization': `Bearer ${authContext.userToken}` }),
          body: JSON.stringify({
            "title": userInput.title,
            "url": userInput.url,
            "detail": userInput.detail,
            "review": userInput.text
          })
        }
      ).then(res => {
        if (res.ok) {
          //　投稿に成功したらリダイレクト
          navigate('/');
        }
        else {
          if (res.status === 400) {
            ErrorRef.current.innerHTML = newReviewError.code400;
            ErrorRef.current.style.display = 'block';
          }
          else if (res.status === 401) {
            localStorage.removeItem('v_|2Q)iA~*rn%');
            authContext.setUserToken(null);
            authContext.setIsAuthorized(false);
          }
          else if (res.status === 500) {
            ErrorRef.current.innerHTML = newReviewError.code500;
            ErrorRef.current.style.display = 'block';
          }
          else {
            throw new Error(res.statusText);
          }
        }
      }).catch(error => {
        navigate('/')
      })
    }
    // フォームが必要な条件を満たしていないならメッセージを表示
    else {
      if (titleRef.current.value === '' || detailRef.current.value === '' || urlRef.current.value === '' || textRef.current.value === '') {
        ErrorRef.current.innerHTML = newReviewError.formInvalid;
        ErrorRef.current.style.display = 'block';
      }
    }
  };

  const checkInput = (): void => {
    // ユーザーの入力をstateに反映
    setUserInput({
      title: titleRef.current.value,
      detail: detailRef.current.value,
      url: urlRef.current.value,
      text: textRef.current.value,
    });
    // フォームに値が入っているかチェック
    if (
      titleRef.current.value !== '' &&
      detailRef.current.value !== '' &&
      urlRef.current.value !== '' &&
      textRef.current.value !== ''
    ) {
      setIsFormValid(true);
    }
    else {
      setIsFormValid(false);
    }
  };

  return (
    <div id="newReviewPage">
      <img className="bg-bookshelf fixed-top" src={background} alt="背景" />
      <div className="container-fuild container-lg">
        <span className="input-group-text abovebg">書籍のタイトル</span>
        <input
          className="form-control mb-3"
          aria-label="With textarea"
          ref={titleRef}
          onChange={() => { checkInput() }}
        />
        <span className="input-group-text">あらすじ・詳細</span>
        <textarea
          className="form-control mb-3"
          id="detail-column"
          aria-label="With textarea"
          ref={detailRef}
          onChange={() => { checkInput() }}
        >
        </textarea>
        <span className="input-group-text">URL(Amazonへのリンクなど)</span>
        <input
          className="form-control mb-3"
          aria-label="With textarea"
          ref={urlRef}
          onChange={() => { checkInput() }}
        />
        <span className="input-group-text">レビュー</span>
        <textarea
          className="form-control"
          id="review-column"
          aria-label="With textarea"
          ref={textRef}
          onChange={() => { checkInput() }}
        >
        </textarea>
        <div className="d-grid gap-2 col-2 mx-auto mt-3">
          <button
            className="btn btn-primary"
            onClick={() => { submit() }}
            ref={btnRef}
          >
            レビューを投稿
          </button>
        </div>
        <div className="errorMessage alert alert-warning mt-3" ref={ErrorRef} role="alert">
        </div>
      </div>
    </div>
  )
})

export default NewReview;