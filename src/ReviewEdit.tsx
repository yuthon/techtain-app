import { memo, ReactElement, useContext, useEffect, useState, useRef } from 'react';
import { AuthorizeContext } from './AuthorizeProvider';
import { useParams, useNavigate } from "react-router-dom";
import background from './bg_5.jpg'

type UserInputType = {
  title: string,
  detail: string,
  url: string,
  text: string
}

type detailType = {
  id: string,
  title: string,
  url: string,
  detail: string,
  review: string,
  reviewer: string,
  isMine: boolean
}

const ReviewEdit = memo((): ReactElement => {

  const { userToken } = useContext(AuthorizeContext);

  let { bookId } = useParams<string>();

  const [userInput, setUserInput] = useState<UserInputType>({title:'',detail:'',url:'',text:''});
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [getError, setGetError] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<boolean>(false);
  const [resStatus, setResStatus] = useState<number>(200);
  const [reviewDetail, setReviewDetail] = useState<detailType>({
    id:'',title:'',url:'',detail:'',review:'',reviewer:'',isMine:false
  });

  const titleRef = useRef<HTMLInputElement>(null!);
  const detailRef = useRef<HTMLTextAreaElement>(null!);
  const urlRef = useRef<HTMLInputElement>(null!);
  const textRef = useRef<HTMLTextAreaElement>(null!);
  const btnRef = useRef<HTMLButtonElement>(null!);
  const deleteBtnRef = useRef<HTMLButtonElement>(null!);

  let ErrorAlert: ReactElement;

  const navigate = useNavigate();

  // 変更を保存する
  const save = async(): Promise<void> => {
    await fetch(
      `https://api-for-missions-and-railways.herokuapp.com/books/${bookId}`,
      {
        method: 'PUT',
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
        setSubmitError(false);
        setResStatus(200);
        navigate(`/detail/${bookId}`);
      }
      else {
        setSubmitError(true);
        if (res.status === 400) {
          setResStatus(400);
        }
        else if (res.status === 403) {
          setResStatus(403);
        }
        else if (res.status === 404) {
          setResStatus(404);
        }
        else if (res.status === 500) {
          setResStatus(500);
        }
      }
    })
  };

  // レビュー詳細を取得
  const getDetail = async(): Promise<void> => {
    const response: detailType = await fetch(
      `https://api-for-missions-and-railways.herokuapp.com/books/${bookId}`,
      {headers: new Headers({ 'Authorization': `Bearer ${userToken}`})}
    ).then(res => {
      if (res.ok) {
        setGetError(false);
        setResStatus(200);
        return res.json();
      }
      else {
        setGetError(true);
        if (res.status === 400) {
          setResStatus(400);
        }
        else if (res.status === 401) {
          setResStatus(401);
        }
        else if (res.status === 404) {
          setResStatus(404);
        }
        else if (res.status === 500) {
          setResStatus(500);
        }
        return null;
      }
    })
    
    if (response) {
      setReviewDetail(response);
    }
  };

  // レビューを削除
  const deleteReview = async(): Promise<void> => {
    await fetch(
      `https://api-for-missions-and-railways.herokuapp.com/books/${bookId}`,
      {
        method: 'DELETE',
        headers: new Headers({ 'Authorization': `Bearer ${userToken}`})
      }
    ).then(res => {
      if (res.ok) {
        setDeleteError(false);
        setResStatus(200);
        navigate('/');
      }
      else {
        setDeleteError(true);
        if (res.status === 400) {
          setResStatus(400);
        }
        else if (res.status === 403) {
          setResStatus(403);
        }
        else if (res.status === 404) {
          setResStatus(404);
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
    // フォームに値が入っているかチェック&フォームの値が変更されているかチェック
    if (
      titleRef.current.value !== '' &&
      detailRef.current.value !== '' &&
      urlRef.current.value !== '' &&
      textRef.current.value !== ''
    ) {
      if (
        titleRef.current.value !== reviewDetail.title ||
        detailRef.current.value !== reviewDetail.detail ||
        urlRef.current.value !== reviewDetail.url ||
        textRef.current.value !== reviewDetail.review
      ) {
        setIsFormValid(true);
      }
    }
    else {
      setIsFormValid(false);
    }
  };

  // エラーが起きたときコンポーネントが再レンダーされるのでエラーメッセージを出す
  if (getError) {
    if (resStatus === 404) {
      ErrorAlert = (
        <div id="submit-error" className="alert alert-danger mt-3 mb-0" role="alert">エラー：投稿が存在しません</div>
      )
    }
    else if (resStatus === 400 || resStatus === 403 || resStatus === 500) {
      ErrorAlert = (
        <div id="submit-error" className="alert alert-danger mt-3 mb-0" role="alert">エラーが起きました。もう一度お試しください</div>
      )
    }
  }

  if (submitError) {
    if (resStatus === 403) {
      ErrorAlert = (
        <div id="submit-error" className="alert alert-danger mt-3 mb-0" role="alert">認証エラー：この投稿を編集する権限がありません</div>
      )
    }
    else if (resStatus === 404) {
      ErrorAlert = (
        <div id="submit-error" className="alert alert-danger mt-3 mb-0" role="alert">エラー：投稿が存在しません</div>
      )
    }
    else if (resStatus === 400 || resStatus === 500) {
      ErrorAlert = (
        <div id="submit-error" className="alert alert-danger mt-3 mb-0" role="alert">エラーが起きました。もう一度お試しください</div>
      )
    }
  }

  if (deleteError) {
    if (resStatus === 403) {
      ErrorAlert = (
        <div id="submit-error" className="alert alert-danger mt-3 mb-0" role="alert">認証エラー：この投稿を削除する権限がありません</div>
      )
    }
    else if (resStatus === 404) {
      ErrorAlert = (
        <div id="submit-error" className="alert alert-danger mt-3 mb-0" role="alert">エラー：投稿が存在しません</div>
      )
    }
    else if (resStatus === 400 || resStatus === 500) {
      ErrorAlert = (
        <div id="submit-error" className="alert alert-danger mt-3 mb-0" role="alert">エラーが起きました。もう一度お試しください</div>
      )
    }
  }

  useEffect(()=>{
    getDetail();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  useEffect(()=>{
    titleRef.current.value = reviewDetail.title;
    detailRef.current.value = reviewDetail.detail;
    urlRef.current.value = reviewDetail.url;
    textRef.current.value = reviewDetail.review;
  },[reviewDetail])

  useEffect(()=>{
    // フォームが必要な条件を満たすならボタンを有効化
    if (isFormValid) {
      btnRef.current.disabled = false
    } else {
      btnRef.current.disabled = true
    }
  })

  return (
    <div id="newReviewPage">
      <img className="bg-bookshelf fixed-top" src={background} alt="背景"/>
      <div className="container-fuild container-lg" >
        <span className="input-group-text">書籍のタイトル</span>
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
          className="form-control mb-3"
          id="review-column"
          aria-label="With textarea"
          ref={textRef}
          onChange={()=>{checkInput()}}
        >
        </textarea>
        <div className="d-flex flex-wrap justify-content-between">
          <button
            className="btn btn-primary d-grid gap-2 col-6"
            onClick={()=>{save()}}
            ref={btnRef}
          >
            保存
          </button>
          <p className="text-white my-auto">または</p>
          <button
            className="btn btn-danger d-grid gap-2 col-3"
            onClick={()=>{deleteReview()}}
            ref={deleteBtnRef}
          >
            レビューの削除
          </button>
        </div>
        {ErrorAlert!}
      </div>
    </div>
  )
})

export default ReviewEdit;