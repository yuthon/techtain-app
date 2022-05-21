import { memo, ReactElement, useState, useContext, useRef } from 'react';
import { AuthorizeContext } from './AuthorizeProvider';
import { Link, useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
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

const MyReviews = memo((): ReactElement => {
  // 表示するレビューのリスト
  const [reviewList, setReviewList] = useState<Array<ReviewType>>([]);
  // apiからまだ呼び出せるか
  const [hasMore, setHasMore] = useState<boolean>(true);
  //認証コンテキスト
  const authContext = useContext(AuthorizeContext);
  // リダイレクト用
  const navigate = useNavigate();
  // エラーメッセージ
  const ErrorRef = useRef<HTMLDivElement>(null!);

  // 項目を読み込むときのコールバック
  const loadMore = async (offset: number): Promise<void> => {
    const response = await fetch(
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
        if (res.status === 401) {
          localStorage.removeItem('v_|2Q)iA~*rn%');
          authContext.setUserToken(null);
          authContext.setIsAuthorized(false);
        }
        else if (res.status === 500) {
          ErrorRef.current.innerHTML = getReviewError.code500;
          ErrorRef.current.style.display = 'block';
        }
        else {
          throw new Error(res.statusText);
        }
      }
    }).catch(error => {
      navigate('/')
    })
    // 自分のレビューだけを抽出
    let listToDisplay: Array<ReviewType> = response.filter((review: ReviewType) => {
      return (
        review.isMine
      )
    })

    //データ件数が0件の場合、処理終了
    if (response.length < 1) {
      setHasMore(false);
      return
    }
    //取得データをリストに追加
    setReviewList([...reviewList, ...listToDisplay]);
  };

  //各スクロール要素
  const items: JSX.Element[] = (
    reviewList.map(
      (review: ReviewType, index: number) => (
        <div className="card review-card text-dark bg-light mb-3 mx-auto" key={index}>
          <Link className="card-detailLink" to={`/detail/${review.id}`}></Link>
          <div className="card-header d-flex justify-content-between">
            <h5 className="fw-bold text-start my-auto">{review.title}</h5>
            <div className="dropdown review-dropdown">
              <button className="dropdown-toggle ellipsis-btn" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                <svg className="ellipsis" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  {/* <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --> */}
                  <path
                    d="M120 256C120 286.9 94.93 312 64 312C33.07 312 8 286.9 8 256C8 225.1 33.07 200 64 200C94.93 200 120 225.1 120 256zM280 256C280 286.9 254.9 312 224 312C193.1 312 168 286.9 168 256C168 225.1 193.1 200 224 200C254.9 200 280 225.1 280 256zM328 256C328 225.1 353.1 200 384 200C414.9 200 440 225.1 440 256C440 286.9 414.9 312 384 312C353.1 312 328 286.9 328 256z"
                    fill="#ced4da"
                    stroke="gray"
                    strokeWidth="15"
                  />
                </svg>
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton1">
                <li><a className="dropdown-item card-link" href={review.url}>書籍へのリンク</a></li>
                <li><Link className="card-link dropdown-item" to={`/detail/${review.id}`}>投稿の詳細</Link></li>
                <li><Link className="card-link dropdown-item" to={`/edit/${review.id}`}>編集</Link></li>
              </ul>
            </div>
          </div>
          <div className="card-body">
            <p className="card-text text-truncate text-start">{review.detail}</p>
            <p className="card-text text-truncate text-start">{review.review}</p>
            <div className="d-flex link-to-profile">
              <Link className="d-flex link-to-profile" to="/profile" >
                <svg className="circle-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  {/* <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --> */}
                  <path
                    d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 128c39.77 0 72 32.24 72 72S295.8 272 256 272c-39.76 0-72-32.24-72-72S216.2 128 256 128zM256 448c-52.93 0-100.9-21.53-135.7-56.29C136.5 349.9 176.5 320 224 320h64c47.54 0 87.54 29.88 103.7 71.71C356.9 426.5 308.9 448 256 448z"
                    fill="#adb5bd"
                  />
                </svg>
              </Link>
              <Link className="d-flex link-to-profile" to="/profile" >
                <p className="my-auto ms-2 username-link">{review.reviewer}</p>
              </Link>
            </div>
          </div>
        </div>
      )
    )
  );

  //ロード中に表示する項目
  const loader: ReactElement = (
    <div className="loader" key={0}>
      読み込み中...
    </div>
  );

  return (
    <>
      <div className="errorMessage alert alert-warning mt-3" ref={ErrorRef} role="alert"></div>
      <InfiniteScroll
        loadMore={loadMore}
        hasMore={hasMore}
        loader={loader}
      >
        {items}
      </InfiniteScroll>
    </>
  )
})

export default MyReviews;