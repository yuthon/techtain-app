import { memo, FC, ReactElement, useContext, useEffect, useState, useRef } from 'react';
import { AuthorizeContext } from './AuthorizeProvider';
import { useParams, useNavigate } from "react-router-dom";
import background from './bg_5.jpg'
import { getDetailError, deleteError, editError } from './ErrorMessages';

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

type ReviewEditProps = {
  setIsError: React.Dispatch<React.SetStateAction<boolean>>
}

const ReviewEdit: FC<ReviewEditProps> = memo(({ setIsError }): ReactElement => {
  // 認証コンテキスト
  const authContext = useContext(AuthorizeContext);
  let { bookId } = useParams<string>();

  const [userInput, setUserInput] = useState<UserInputType>({ title: '', detail: '', url: '', text: '' });
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [reviewDetail, setReviewDetail] = useState<detailType>({
    id: '', title: '', url: '', detail: '', review: '', reviewer: '', isMine: false
  });

  const titleRef = useRef<HTMLInputElement>(null!);
  const detailRef = useRef<HTMLTextAreaElement>(null!);
  const urlRef = useRef<HTMLInputElement>(null!);
  const textRef = useRef<HTMLTextAreaElement>(null!);
  // エラーメッセージ
  const ErrorRef = useRef<HTMLDivElement>(null!);

  const navigate = useNavigate();

  // 変更を保存する
  const save = async (): Promise<void> => {
    // フォームを値をチェックしてから値を送信するか決める
    if (isFormValid) {
      await fetch(
        `https://api-for-missions-and-railways.herokuapp.com/books/${bookId}`,
        {
          method: 'PUT',
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
          navigate(`/detail/${bookId}`);
        }
        else {
          if (res.status === 400) {
            ErrorRef.current.innerHTML = editError.code400;
            ErrorRef.current.style.display = 'block';
          }
          else if (res.status === 401) {
            localStorage.removeItem('v_|2Q)iA~*rn%');
            authContext.setUserToken(null);
            authContext.setIsAuthorized(false);
            setIsError(true);
          }
          else if (res.status === 404) {
            ErrorRef.current.innerHTML = editError.code404;
            ErrorRef.current.style.display = 'block';
          }
          else if (res.status === 500) {
            ErrorRef.current.innerHTML = editError.code500;
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
  };

  // レビュー詳細を取得
  const getDetail = async (): Promise<void> => {
    const response: detailType = await fetch(
      `https://api-for-missions-and-railways.herokuapp.com/books/${bookId}`,
      { headers: new Headers({ 'Authorization': `Bearer ${authContext.userToken}` }) }
    ).then(res => {
      if (res.ok) {
        return res.json();
      }
      else {
        if (res.status === 400) {
          ErrorRef.current.innerHTML = getDetailError.code400;
          ErrorRef.current.style.display = 'block';
        }
        else if (res.status === 401) {
          localStorage.removeItem('v_|2Q)iA~*rn%');
          authContext.setUserToken(null);
          authContext.setIsAuthorized(false);
          setIsError(true);
        }
        else if (res.status === 404) {
          ErrorRef.current.innerHTML = getDetailError.code404;
          ErrorRef.current.style.display = 'block';
        }
        else if (res.status === 500) {
          ErrorRef.current.innerHTML = getDetailError.code500;
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

    if (response) {
      setReviewDetail(response);
    }
  };

  // レビューを削除
  const deleteReview = async (): Promise<void> => {
    await fetch(
      `https://api-for-missions-and-railways.herokuapp.com/books/${bookId}`,
      {
        method: 'DELETE',
        headers: new Headers({ 'Authorization': `Bearer ${authContext.userToken}` })
      }
    ).then(res => {
      if (res.ok) {
        navigate('/');
      }
      else {
        if (res.status === 400) {
          ErrorRef.current.innerHTML = deleteError.code400;
          ErrorRef.current.style.display = 'block';
        }
        else if (res.status === 401) {
          localStorage.removeItem('v_|2Q)iA~*rn%');
          authContext.setUserToken(null);
          authContext.setIsAuthorized(false);
          setIsError(true);
        }
        else if (res.status === 404) {
          ErrorRef.current.innerHTML = deleteError.code404;
          ErrorRef.current.style.display = 'block';
        }
        else if (res.status === 500) {
          ErrorRef.current.innerHTML = deleteError.code500;
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
  };

  const checkInput = (): void => {
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

  useEffect(() => {
    getDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    titleRef.current.value = reviewDetail.title;
    detailRef.current.value = reviewDetail.detail;
    urlRef.current.value = reviewDetail.url;
    textRef.current.value = reviewDetail.review;
  }, [reviewDetail])

  return (
    <div id="newReviewPage">
      <img className="bg-bookshelf fixed-top" src={background} alt="背景" />
      <div className="container-fuild container-lg" >
        <span className="input-group-text">書籍のタイトル</span>
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
          className="form-control mb-3"
          id="review-column"
          aria-label="With textarea"
          ref={textRef}
          onChange={() => { checkInput() }}
        >
        </textarea>
        <div className="d-flex flex-wrap justify-content-between">
          <button
            className="btn btn-primary d-grid gap-2 col-6"
            onClick={() => { save() }}
          >
            保存
          </button>
          <p className="text-white my-auto">または</p>
          <button
            className="btn btn-danger d-grid gap-2 col-3"
            onClick={() => { deleteReview() }}
          >
            レビューの削除
          </button>
        </div>
        <div className="errorMessage alert alert-danger mt-3 mb-0" ref={ErrorRef}></div>
      </div>
    </div>
  )
})

export default ReviewEdit;