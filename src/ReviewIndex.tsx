import { memo, FC, ReactElement, useState, useContext, useRef, useEffect } from 'react';
import InfiniteScroll from "react-infinite-scroller"
import { AuthorizeContext } from './AuthorizeProvider';
import background from './bg_5.jpg'
import ReviewCard from './ReviewCard';
import { getReviewError } from './ErrorMessages';

type ReviewType = {
  detail: string,
  id: string,
  isMine?: boolean,
  review: string,
  reviewer: string,
  title: string,
  url: string,
}

type ReviewIndexProps = {
  setIsError: React.Dispatch<React.SetStateAction<boolean>>
}

const ReviewIndex: FC<ReviewIndexProps> = memo(({ setIsError }): ReactElement => {
  // 表示するリスト
  const [reviewList, setReviewList] = useState<Array<ReviewType>>([]);
  //再読み込み判定
  const [hasMore, setHasMore] = useState<boolean>(true);
  // 認証コンテキスト
  const authContext = useContext(AuthorizeContext);
  // チェックボックス
  const checkLinkRef = useRef<HTMLInputElement>(null!);
  const checkCountRef = useRef<HTMLInputElement>(null!);
  // フィルタリングの文字数指定
  const characterCountRef = useRef<HTMLInputElement>(null!);
  // フィルタリング判定
  const [validLinkNeeded, setValidLinkNeeded] = useState<boolean>(false);
  const [characterCountNeeded, setCharacterCountNeeded] = useState<boolean>(false);
  // エラーメッセージ
  const ErrorRef = useRef<HTMLDivElement>(null!);
  // Infinite Scrollのkeyプロパティに入れる値
  const key = useRef<number>(1);
  let keyNumber = key.current;

  //項目を読み込むときのコールバック
  const loadMore = async (offset: number): Promise<void> => {
    // api呼び出し
    let response: Array<ReviewType> = await fetch(
      `https://api-for-missions-and-railways.herokuapp.com/books?offset=${offset * 10 - 10}`,
      {
        method: 'GET',
        headers: new Headers({ 'Authorization': `Bearer ${authContext.userToken}` })
      }
    ).then(res => {
      if (res.ok) {
        return res.json();
      }
      // 400番がどういうときに返ってくるか不明
      // 401番が返ってきたら認証エラーなので再度ログインさせる
      // 500番台はどうすれば？
      else {
        if (res.status === 400) {
          ErrorRef.current.innerHTML = getReviewError.code400;
          ErrorRef.current.style.display = 'block';
        }
        else if (res.status === 401) {
          localStorage.removeItem('v_|2Q)iA~*rn%');
          authContext.setUserToken(null);
          authContext.setIsAuthorized(false);
          setIsError(true);
        }
        else if (res.status === 500) {
          ErrorRef.current.innerHTML = getReviewError.code500;
          ErrorRef.current.style.display = 'block';
        }
        // 506番など特殊なエラー
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

    //データ件数が0件の場合、処理終了
    if (response.length < 1) {
      setHasMore(false);
      return;
    }
    // フィルタリングがONになっている場合
    if (validLinkNeeded) {
      response = response.filter((review: ReviewType) => {
        // httpという文字列を含んでいれば有効なurlとみなす
        return review.url.includes('http')
      })
    }
    if (characterCountNeeded) {
      response = response.filter((review: ReviewType) => {
        // 入力欄の値を整数にして比較
        return review.review.length > parseInt(characterCountRef.current.value)
      })
    }
    //取得データをリストに追加
    setReviewList([...reviewList, ...response]);
  }

  //各スクロール要素
  const items: JSX.Element[] = (
    reviewList.map(
      (review: ReviewType, index: number) => (
        <ReviewCard review={review} key={index} setIsError={setIsError} />
      )
    )
  );

  //ロード中に表示する項目
  const loader: ReactElement = (
    <div className="loader" key={0}>
      読み込み中...
    </div>
  );

  // フィルタリング
  const filter = async () => {
    // チェックボックスの状態に基づいてstateの更新
    if (checkLinkRef.current.checked) {
      setValidLinkNeeded(true);
    } else {
      setValidLinkNeeded(false);
    }
    if (checkCountRef.current.checked) {
      setCharacterCountNeeded(true);
    } else {
      setCharacterCountNeeded(false);
    }
    // keyプロパティに代入する値を変化させてinfinite scrollerをリセットさせる
    key.current = keyNumber + 1;
    // 一度配列を初期化
    setReviewList([]);
    // setHasMoreがfalseになっているかもしないので再設定
    setHasMore(true);
  }

  // 文字数入力欄を半角数字に限定
  const onlyAllowNumber = () => {
    characterCountRef.current.value = (
      characterCountRef.current.value
        .replace(/[^0-9.]/g, '')
        .replace(/(\..*)\./g, '$1')
    )
  };

  // 文字数入力欄の初期値
  useEffect(() => {
    characterCountRef.current.value = "50"
  }, [])

  return (
    <div id="reviewPage">
      <img className="bg-bookshelf fixed-top" src={background} alt="背景" />
      <div className="container-fuild container-lg">
        <div className="errorMessage alert alert-warning mt-3" ref={ErrorRef} role="alert"></div>
        <button
          className="btn btn-secondary filter-btn"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#filter-menu"
          aria-expanded="false"
          aria-controls="filter-menu"
        >
          <svg width="25px" height="25px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
            {/* <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --> */}
            <path
              d="M416 288h-95.1c-17.67 0-32 14.33-32 32s14.33 32 32 32H416c17.67 0 32-14.33 32-32S433.7 288 416 288zM352 416h-32c-17.67 0-32 14.33-32 32s14.33 32 32 32h32c17.67 0 31.1-14.33 31.1-32S369.7 416 352 416zM480 160h-159.1c-17.67 0-32 14.33-32 32s14.33 32 32 32H480c17.67 0 32-14.33 32-32S497.7 160 480 160zM544 32h-223.1c-17.67 0-32 14.33-32 32s14.33 32 32 32H544c17.67 0 32-14.33 32-32S561.7 32 544 32zM151.6 41.95c-12.12-13.26-35.06-13.26-47.19 0l-87.1 96.09C4.475 151.1 5.35 171.4 18.38 183.3c6.141 5.629 13.89 8.414 21.61 8.414c8.672 0 17.3-3.504 23.61-10.39L96 145.9v302C96 465.7 110.3 480 128 480s32-14.33 32-32.03V145.9L192.4 181.3C204.4 194.3 224.6 195.3 237.6 183.3c13.03-11.95 13.9-32.22 1.969-45.27L151.6 41.95z"
              fill="white"
            />
          </svg>
          <span className="ms-2">フィルター</span>
        </button>
        <div className="collapse multi-collapse" id="filter-menu">
          <div className="card card-body">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="flexCheckDefault"
                ref={checkLinkRef}
              />
              <label className="form-check-label">
                有効なURLが書籍へのリンクに添付されている
              </label>
            </div>
            <div className="d-flex">
              <input
                className="form-check-input my-auto"
                type="checkbox"
                id="flexCheckDefault"
                ref={checkCountRef}
              />
              <p className="my-auto mx-2">
                レビューの文字数が
              </p>
              <input
                className="form-control"
                ref={characterCountRef}
                onChange={() => { onlyAllowNumber() }}
                placeholder="半角数字"
                style={{ width: "6rem", height: "2.25rem" }}
              />
              <p className="my-auto ms-2">文字以上</p>
            </div>
            <button
              className="btn btn-sm btn-primary"
              style={{ width: "3.5rem" }}
              onClick={() => { filter() }}
            >
              適用
            </button>
          </div>
        </div>
        {reviewList.length < 1 && !hasMore ? (
          <div className="alert alert-warning mt-5" role="alert">
            レビューが見つかりませんでした
          </div>
        ) : (null)}
        <InfiniteScroll
          key={key.current}
          loadMore={loadMore}
          hasMore={hasMore}
          loader={loader}
        >
          {items}
        </InfiniteScroll>
      </div>
    </div>
  )
})

export default ReviewIndex;