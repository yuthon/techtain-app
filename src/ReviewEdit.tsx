import { ReactElement, useContext, useEffect, useState, useRef } from 'react';
import { AuthorizeContext } from './AuthorizeProvider';
import { useParams } from "react-router-dom";

type UserInputType = {
  title: string,
  detail: string,
  url: string,
  text: string
}

const ReviewEdit = (): ReactElement => {

  const { userToken } = useContext(AuthorizeContext);

  let { bookId } = useParams<string>();

  const [userInput, setUserInput] = useState<UserInputType>({title:'',detail:'',url:'',text:''});
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<boolean>(false);
  const [resStatus, setResStatus] = useState<number>(200);

  const titleRef = useRef<HTMLInputElement>(null!);
  const detailRef = useRef<HTMLInputElement>(null!);
  const urlRef = useRef<HTMLInputElement>(null!);
  const textRef = useRef<HTMLTextAreaElement>(null!);
  const btnRef = useRef<HTMLButtonElement>(null!);
  const deleteBtnRef = useRef<HTMLButtonElement>(null!);

  async function save(): Promise<void> {
    const url = await fetch(
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
      return res.json();
    })
    if (await url.token) {
      setResStatus(200);
      setLoginError(false);
      console.log(await url.token);
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
  };

  async function deleteReview(): Promise<void> {
    const review = await fetch(
      `https://api-for-missions-and-railways.herokuapp.com/books/${bookId}`,
      {
        method: 'DELETE',
        headers: new Headers({ 'Authorization': `Bearer ${userToken}`})
      }
    ).then(res => {
      return res;
    })
    if (await review) {
      setResStatus(200);
      setLoginError(false);
    } else {
      // if (await review.ErrorCode) {
      //   if (await review.ErrorCode === 400) {
      //     console.log(await review.ErrorMessageJP)
      //     setResStatus(400);
      //     setLoginError(true);
      //   }
      //   else if (await review.ErrorCode === 403) {
      //     console.log(await review.ErrorMessageJP)
      //     setResStatus(403);
      //     setLoginError(true);
      //   }
      //   else if (await review.ErrorCode === 500) {
      //     console.log(await review.ErrorMessageJP)
      //     setResStatus(500);
      //     setLoginError(true);
      //   }
      // }
    }
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
      btnRef.current.disabled = false
    } else {
      btnRef.current.disabled = true
    }
  })

  return (
    <div>
      <span className="input-group-text">書籍のタイトル</span>
      <input className="form-control" aria-label="With textarea" ref={titleRef} onChange={()=>{checkInput()}} />
      <span className="input-group-text">あらすじ・詳細</span>
      <input className="form-control" aria-label="With textarea" ref={detailRef} onChange={()=>{checkInput()}} />
      <span className="input-group-text">URL(Amazonへのリンクなど)</span>
      <input className="form-control" aria-label="With textarea" ref={urlRef} onChange={()=>{checkInput()}} />
      <span className="input-group-text">レビュー</span>
      <textarea className="form-control" id="review-column" aria-label="With textarea" ref={textRef} onChange={()=>{checkInput()}} ></textarea>
      <button className="btn btn-primary" onClick={()=>{save()}} ref={btnRef}>保存</button>
      <button className="btn btn-primary" onClick={()=>{deleteReview()}} ref={deleteBtnRef}>レビューの削除</button>
    </div>
  )
}

export default ReviewEdit;