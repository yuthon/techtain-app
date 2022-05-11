import { memo, ReactElement, useContext, useEffect, useState, useRef } from 'react';
import { AuthorizeContext } from './AuthorizeProvider';
import background from './bg_5.jpg'
import { useNavigate } from "react-router-dom";

type UserInputType = {
  title: string,
  detail: string,
  url: string,
  text: string
}

const NewReview = memo(():ReactElement => {
  const { userToken } = useContext(AuthorizeContext);

  const [userInput, setUserInput] = useState<UserInputType>({title:'',detail:'',url:'',text:''});
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [resStatus, setResStatus] = useState<number>(200);
  const [isError, setIsError] = useState<boolean>(false);

  const titleRef = useRef<HTMLInputElement>(null!);
  const detailRef = useRef<HTMLTextAreaElement>(null!);
  const urlRef = useRef<HTMLInputElement>(null!);
  const textRef = useRef<HTMLTextAreaElement>(null!);
  const btnRef = useRef<HTMLButtonElement>(null!);

  let ErrorAlert: ReactElement;

  const navigate = useNavigate();

  const submit = async(): Promise<void> => {
    await fetch(
      "https://api-for-missions-and-railways.herokuapp.com/books",
      {
        method: 'POST',
        headers: new Headers({ 'Authorization': `Bearer ${userToken}`}),
        body: JSON.stringify({
          "title": userInput.title,
          "url": userInput.url,
          "detail": userInput.detail,
          "review": userInput.text
        })
      }
    ).then(res => {
      if (res.ok) {
        setIsError(false);
        setResStatus(200);
        navigate('/');
      }
      else {
        setIsError(true);
        if (res.status === 400) {
          setResStatus(400);
        }
        else if (res.status === 401) {
          setResStatus(401);
        }
        else {
          setResStatus(500);
        }
      }
    })
  };

  const checkInput = (): void =>{
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

  useEffect(()=>{
    // フォームが必要な条件を満たすならボタンを有効化
    if (isFormValid) {
      btnRef.current.disabled = false;
    } else {
      btnRef.current.disabled = true;
    }
  })

  // エラーが起きたときコンポーネントが再レンダーされるのでエラーメッセージを出す
  if (isError) {
    if (resStatus === 400) {
      ErrorAlert = (
        <div className="alert alert-warning mt-3" role="alert">
          エラー：すべてのフォームを埋めてください
        </div>
      );
    }
    else if (resStatus === 401) {
      ErrorAlert = (
        <div className="alert alert-warning mt-3" role="alert">
          認証エラーが起きました。しばらくしてからもう一度お試しください
        </div>
      );
    }
    else if (resStatus === 500) {
      ErrorAlert = (
        <div className="alert alert-warning mt-3" role="alert">
          エラーが起きました。しばらくしてからもう一度お試しください
        </div>
      );
    }
  }

  return (
    <div id="newReviewPage">
      <img className="bg-bookshelf fixed-top" src={background} alt="背景"/>
      <div className="container-fuild container-lg">
        <span className="input-group-text abovebg">書籍のタイトル</span>
        <input
          className="form-control mb-3"
          aria-label="With textarea"
          ref={titleRef}
          onChange={()=>{checkInput()}}
        />
        <span className="input-group-text">あらすじ・詳細</span>
        <textarea
          className="form-control mb-3"
          id="detail-column"
          aria-label="With textarea"
          ref={detailRef}
          onChange={()=>{checkInput()}}
        >
        </textarea>
        <span className="input-group-text">URL(Amazonへのリンクなど)</span>
        <input
          className="form-control mb-3"
          aria-label="With textarea"
          ref={urlRef}
          onChange={()=>{checkInput()}}
        />
        <span className="input-group-text">レビュー</span>
        <textarea
          className="form-control"
          id="review-column"
          aria-label="With textarea"
          ref={textRef}
          onChange={()=>{checkInput()}} 
        >
        </textarea>
        <div className="d-grid gap-2 col-2 mx-auto mt-3">
          <button
            className="btn btn-primary"
            onClick={()=>{submit()}}
            ref={btnRef}
          >
            レビューを投稿
          </button>
        </div>
        {ErrorAlert!}
      </div>
    </div>
  )
})

export default NewReview;