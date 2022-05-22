import { memo, FC, ReactElement, useState, useContext, useRef } from 'react';
import { AuthorizeContext } from './AuthorizeProvider';
import ReviewCard from './ReviewCard';
import InfiniteScroll from 'react-infinite-scroller';
import { getReviewError } from '../assets/ErrorMessages';

type ReviewType = {
  detail: string,
  id: string,
  isMine?: boolean,
  review: string,
  reviewer: string,
  title: string,
  url: string,
}

type MyReviewProps = {
  setIsError: React.Dispatch<React.SetStateAction<boolean>>
}


const MyReviews: FC<MyReviewProps> = memo(({ setIsError }): ReactElement => {
  // 表示するレビューのリスト
  const [reviewList, setReviewList] = useState<Array<ReviewType>>([]);
  // apiからまだ呼び出せるか
  const [hasMore, setHasMore] = useState<boolean>(true);
  //認証コンテキスト
  const authContext = useContext(AuthorizeContext);
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