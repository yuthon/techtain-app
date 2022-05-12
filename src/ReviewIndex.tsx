import { memo, ReactElement, useState, useContext } from 'react';
import InfiniteScroll  from "react-infinite-scroller"
import { AuthorizeContext } from './AuthorizeProvider';
import background from './bg_5.jpg'
import ReviewCard from './ReviewCard';
import SearchSection from './SearchSection';

type ReviewType = {
  detail: string,
  id: string,
  isMine?: boolean,
  review: string,
  reviewer: string,
  title: string,
  url: string,
}

const ReviewIndexAuth = memo((): ReactElement => {
  // 表示するリスト
  const [reviewList, setReviewList] = useState<Array<ReviewType>>([]);
  //再読み込み判定
  const [hasMore, setHasMore] = useState<boolean>(true);
  // エラー判定
  const [isError, setIsError] = useState<boolean>(false);
  // 認証トークン
  const { userToken } = useContext(AuthorizeContext);

  //項目を読み込むときのコールバック
  const loadMore = async (offset: number): Promise<void> => {
    // api呼び出し
    const response: Array<ReviewType> = await fetch(
      `https://api-for-missions-and-railways.herokuapp.com/books?offset=${offset*10-10}`,
      {
        method: 'GET',
        headers: new Headers({ 'Authorization': `Bearer ${userToken}`})
      }
    ).then(res => {
      if (res.ok) {
        setIsError(false);
        return res.json();
      }
      else {
        setIsError(true);
      }
    })

    //データ件数が0件の場合、処理終了
    if (response.length < 1) {
      setHasMore(false);
      return;
    }
    //取得データをリストに追加
    setReviewList([...reviewList, ...response]);
  };

  //各スクロール要素
  const items: JSX.Element[] = (
    reviewList.map(
      (review: ReviewType, index: number) => (
        <ReviewCard review={review} key={index} />
      )
    )
  );

  //ロード中に表示する項目
  const loader: ReactElement = (
    <div className="loader" key={0}>
      読み込み中...
    </div>
  );

  return isError ? (
    <div id="reviewPage-error">
      <img className="bg-bookshelf fixed-top" src={background} alt="背景"/>
      <div className="container-fuild container-lg">
        <div className="alert alert-warning mt-5" role="alert">
          エラーが起きました。しばらくしてからもう一度お試しください。
        </div>
      </div>
    </div>
  ) : (
    <div id="reviewPage">
      <img className="bg-bookshelf fixed-top" src={background} alt="背景"/>
      <div className="container-fuild container-lg">
        <SearchSection />
        <InfiniteScroll
          loadMore={loadMore}    //項目を読み込む際に処理するコールバック関数
          hasMore={hasMore}      //読み込みを行うかどうかの判定
          loader={loader}
        >                       {/* 読み込み最中に表示する項目 */}
          {items}             {/* 無限スクロールで表示する項目 */}
        </InfiniteScroll>
      </div>
    </div>
  )
})

export default ReviewIndexAuth;