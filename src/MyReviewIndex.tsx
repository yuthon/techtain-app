import { ReactElement, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthorizeContext } from './AuthorizeProvider';

type ReviewType = {
  detail: string,
  id: string,
  isMine?: boolean,
  review: string,
  reviewer: string,
  title: string,
  url: string,
}

function MyReviewIndex (): ReactElement {
  const [reviews, setReViews] = useState<Array<ReviewType>>([{detail:'',id:'',review:'',reviewer:'',title:'',url:''}]);

  const { userToken } = useContext(AuthorizeContext);

  async function getReviews(): Promise<void> {
    let listToDisplay: Array<ReviewType>;
    // テスト投稿のレビューを除外して、レビューを取得する
    // まずapiから最初の10件を取得
    const reviewList = await fetch(`https://api-for-missions-and-railways.herokuapp.com/books`
    , {headers: new Headers({ 'Authorization': `Bearer ${userToken}`})}
    ).then(res => {
      return res.json();
    })
    // テスト投稿のレビューを除外する
    listToDisplay = reviewList.filter((review: ReviewType)=>{
      return (
        // 有効なurlが含まれるかどうか
        review.url.indexOf('http') > -1 &&
        // 詳細が30文字以上
        review.detail.length > 30 &&
        // レビューが5文字以上
        review.review.length > 4
      )
    })
    // 同一の書籍に対するレビューを除外する
    listToDisplay = listToDisplay.filter((review: ReviewType, index, self)=>{
      // 書籍タイトルだけを抽出してリスト化
      const titleList = self.map(review => review.title);
      return (
        titleList.indexOf(review.title) === index
      )
    })
    // フィルター後のレビュー数が10に満たない場合、10を超えるまでapiからレビューを取得し続ける
    // ただし、api呼び出しは最大で4回までとする
    for (let i=0; i < 4; i ++) {
      if (listToDisplay.length < 10) {
        const reviewList = await fetch(`https://api-for-missions-and-railways.herokuapp.com/books?offset=${(i+1)*10}`
        , {headers: new Headers({ 'Authorization': `Bearer ${userToken}`})}
        ).then(res => {
          return res.json();
        })
        // テスト投稿のレビューを除外する
        let list: Array<ReviewType> = reviewList.filter((review: ReviewType)=>{
          return (
            // 有効なurlが含まれるかどうか
            review.url.indexOf('http') > -1 &&
            // 詳細が30文字以上
            review.detail.length > 30 &&
            // レビューが5文字以上
            review.review.length > 4
          )
        })
        // 同一の書籍に対するレビューを除外する
        list = list.filter((review: ReviewType, index, self)=>{
          const titleList = self.map(review => review.title);
          return (
            titleList.indexOf(review.title) === index
          )
        })
        // 配列を結合
        listToDisplay = listToDisplay.concat(list);
        // 結合した後の配列に書籍の重複があれば削除
        listToDisplay = listToDisplay.filter((review: ReviewType, index, self)=>{
          // 書籍タイトルだけを抽出してリスト化
          const titleList = self.map(review => review.title);
          return (
            titleList.indexOf(review.title) === index
          )
        })
      } else {
        // 10件を超えたらループを抜ける
        break
      }
    }

    console.log(listToDisplay)

    setReViews(listToDisplay);
    if (await reviewList) {
      // console.log(await reviewList)
    } else {
      if (await reviewList.ErrorCode) {
        if (await reviewList.ErrorCode === 400) {
          console.log(await reviewList.ErrorMessageJP)
        }
        else if (await reviewList.ErrorCode === 401) {
          console.log(await reviewList.ErrorMessageJP)
        }
        else if (await reviewList.ErrorCode === 500) {
          console.log(await reviewList.ErrorMessageJP)
        }
      }
    }
  }



  useEffect(()=>{
    getReviews();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  
  return (
    <>
      <h2>Review Index</h2>
      {reviews!.map(
        (review: ReviewType, index: number) => (
          <div className="border" key={index}>
            <h4>{review.title}</h4>
            <p>{review.detail}</p>
            <p>{review.review}</p>
            <p>{review.reviewer}</p>
            <a href={review.url}>書籍へのリンク</a>
          </div>
        )
      )}
      <nav>
        <Link to="/about">About</Link>
      </nav>
      <nav>
        <Link to="/signup">SignUp</Link>
      </nav>
      <nav>
        <Link to="/login">Log In</Link>
      </nav>
      <nav>
        <Link to="/">Home</Link>
      </nav>
    </>
  )
}

export default MyReviewIndex;