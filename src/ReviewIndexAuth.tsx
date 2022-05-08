import { ReactElement, useState, useContext } from 'react';
import { Link } from "react-router-dom";
import InfiniteScroll  from "react-infinite-scroller"
import { AuthorizeContext } from './AuthorizeProvider';

type ReviewType = {
  detail?: string,
  id?: string,
  isMine?: boolean,
  review?: string,
  reviewer?: string,
  title?: string,
  url?: string,
}

const ReviewIndexAuth = (): ReactElement => {
  // 表示するリスト
  const [reviewList, setReviewList] = useState<Array<ReviewType>>([]);
  //再読み込み判定
  const [hasMore, setHasMore] = useState<boolean>(true);

  const { userToken } = useContext(AuthorizeContext);

  //項目を読み込むときのコールバック
  const loadMore = async (offset: number) => {
      
    const response = await fetch(
      `https://api-for-missions-and-railways.herokuapp.com/public/books?offset=${offset*10-10}`,
      {
        method: 'GET',
        headers: new Headers({ 'Authorization': `Bearer ${userToken}`})
      }
    ).then(res => {
      return res.json();
    })
    .catch(error => {
      console.error(error.json());
    });

    //データ件数が0件の場合、処理終了
    if (response.length < 1) {
      setHasMore(false);
      return;
    }
    //取得データをリストに追加
    setReviewList([...reviewList, ...response])
  }

  //各スクロール要素
  const items = (
      reviewList.map(
        (review: ReviewType, index: number) => 
          <div className="card review-card text-dark bg-light mb-3 mx-auto" key={index}>
            <div className="card-header">
              <h5 className="fw-bold">{review.title}</h5>
            </div>
            <div className="card-body">
              <p className="card-text text-truncate">{review.detail}</p>
              <p className="card-text text-truncate">{review.review}</p>
              <p>{review.reviewer}</p>
              <a className="card-link" href={review.url}>書籍へのリンク</a>
              <Link className="card-link" to={`/detail/${review.id}`}>詳細</Link>
            </div>
          </div>
        )
      )
    

  //ロード中に表示する項目
  const loader =<div className="loader" key={0}>Loading ...</div>;

  return (
    <>
      <h2>Review Index</h2>
      <div className="">
        <InfiniteScroll
          loadMore={loadMore}    //項目を読み込む際に処理するコールバック関数
          hasMore={hasMore}      //読み込みを行うかどうかの判定
          loader={loader}
        >                       {/* 読み込み最中に表示する項目 */}
          {items}             {/* 無限スクロールで表示する項目 */}
        </InfiniteScroll>
      </div>
    </>
  )
}

export default ReviewIndexAuth;