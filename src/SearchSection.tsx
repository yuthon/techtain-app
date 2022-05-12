import { ReactElement, useState, useContext, useRef } from 'react';
import { AuthorizeContext } from './AuthorizeProvider';
import ReviewCard from './ReviewCard';
import Fuse from 'fuse.js';

type ReviewType = {
  detail: string,
  id: string,
  isMine?: boolean,
  review: string,
  reviewer: string,
  title: string,
  url: string,
}

// Fuseを使った検索のオプション
const options: object = {
     findAllMatches: true,
  	 minMatchCharLength: 2,
     threshold: 0.4,
  keys: [
    'title'
  ]
};

const SearchSection = (): ReactElement => {
  // 認証トークン
  const { userToken } = useContext(AuthorizeContext);
  // エラー判定
  const [isError, setIsError] = useState<boolean>(false);
  // 検索欄
  const searchRef = useRef<HTMLInputElement>(null!);
  // 検索結果
  const [listMatched, setListMatched] = useState<Array<ReviewType>>([]);
  // 検索がヒットしたかどうか
  const [noResults, setNoResults] = useState<boolean>(false);
  // 検索中
  const [onSearch, setOnsearch] = useState<boolean>(false);

  //検索結果を代入するための変数
  let matchedReviews: JSX.Element[];
  // 検索中のメッセージ
  let onSearchMessage: ReactElement;
  // 検索結果がなかった時のメッセージ
  let noResultsMessage: ReactElement;
  
  // 検索機能
  const search = async (): Promise<void> => {
    // まず検索中に設定
    setOnsearch(true);

    let offset: number = 0
    // 必ず1度は実行されるように1を代入
    let responseLength: number = 1;

    // ループ実行後にstateを更新するためのリスト
    let match: Array<ReviewType> = [];

    // 検索欄に入力された文字列
    let input: string = searchRef.current.value;

    do {
      // api呼び出し
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
      // Fuseを使ってapiから返ってきた配列を検索
      const fuse = new Fuse(response, options);
      let results: Fuse.FuseResult<ReviewType>[] = fuse.search(input);
      // itemの項だけを抽出してreviewだけを取り出す
      response = results.map(result => result.item);
      // 配列を結合
      match = match.concat(response);
      offset = offset + 10;
    } while (
        // apiからデータが返ってこなくなるまで検索
        responseLength >= 1
      )
    //マッチしたデータをリストに追加
    setListMatched(match);
    // 検索して該当する結果が無かったとき
    if (match.length < 1) {
      setNoResults(true);
    } else {
      setNoResults(false);
    }
    // 検索終了
    setOnsearch(false);
  };
  
  // 検索中に表示する要素
  if (onSearch) {
    onSearchMessage = (
      <div className="alert alert-info mt-3" role="alert">
        検索中...
      </div>
    );
  }

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

  // 検索結果がなかったとき
  if (noResults) {
    noResultsMessage = (
      <div className="alert alert-warning mt-3" role="alert">
        検索ワードに該当する書籍は見つかりませんでした
      </div>
    );
  }

  return (
    <>
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
          onClick={()=>{search()}}
        >
          検索
        </button>
      </div>
      {onSearchMessage!}
      {noResultsMessage!}
      {isError ? (
        <div className="alert alert-warning mt-5" role="alert">
          エラーが起きました。しばらくしてからもう一度お試しください。
        </div>
      ) : matchedReviews!}
    </>
  )
}

export default SearchSection;