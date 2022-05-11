import { memo, ReactElement, useState, useContext, useRef } from 'react';
import InfiniteScroll  from "react-infinite-scroller"
import { AuthorizeContext } from './AuthorizeProvider';
import background from './bg_5.jpg'
import ReviewCard from './ReviewCard';

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
  // 認証コンテキストからトークンを持ってくる
  const { userToken } = useContext(AuthorizeContext);
  // 検索欄
  const searchRef = useRef<HTMLInputElement>(null!);
  // 検索結果
  const [listMatched, setListMatched] = useState<Array<ReviewType>>([]);

  //検索結果を代入するための変数
  let matchedReviews: JSX.Element[];

  //項目を読み込むときのコールバック
  const loadMore = async (offset: number): Promise<void> => {
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

  // 検索機能
  const test = async (): Promise<void> => {
    let offset: number = 0
    // 必ず1度は実行されるように1を代入
    let responseLength: number = 1;

    // ループ実行後にstateを更新するためのリスト
    let match: Array<ReviewType> = [];

    // 検索欄に入力された文字列
    let input: string = searchRef.current.value;
    // 空白を全て削除
    input.replaceAll(/\s+/g, '');
    // 全角の英数字を半角に直す
    input = input.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
    // 大文字小文字を無視して正規表現化
    const str = new RegExp(input, 'i');

    do {
      let response: Array<ReviewType> = await fetch(
        `https://api-for-missions-and-railways.herokuapp.com/books?offset=${offset}`,
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

      // 条件の更新
      responseLength = response.length;
      // testメソッドでフィルター
      response = response.filter((review: ReviewType)=>{
        return (
          // 全角の英数字は半角に直し、スペースは削除して比較する
          str.test(
            (review.title.replace(
              /[Ａ-Ｚａ-ｚ０-９]/g,
              (s) => {
                return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
              }
            )).replaceAll(/\s+/g, '')
          )
        )
      })
      // 配列を結合
      match = match.concat(response);
      offset = offset + 10;
    } while (
        // apiからデータが返ってこなくなるまで検索
        responseLength >= 1
      )
    //マッチしたデータをリストに追加
    setListMatched(match);
  };

  // コンポーネントが再レンダーされた際、listMatchedに要素が入っていたら表示する
  if (listMatched.length > 0) {
    matchedReviews = (
      listMatched.map(
        (review: ReviewType, index: number) => (
          <ReviewCard review={review} key={index} />
        )
      )
    )
  }

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
        <div className="d-flex">
          <input
            className="form-control me-2"
            type="search"
            placeholder="書籍を検索"
            aria-label="Search"
            ref={searchRef}
          />
          <button
            className="btn btn-success"
            type="submit"
            onClick={()=>{test()}}
          >
            検索
          </button>
        </div>
        {matchedReviews!}
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