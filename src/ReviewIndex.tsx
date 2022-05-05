import { ReactElement, useEffect, useState } from 'react';

type ReviewType = {
  detail: string,
  id: string,
  review: string,
  reviewer: string,
  title: string,
  url: string,
}


function ReviewIndex (): ReactElement {
  const [reviews, setReViews] = useState<Array<ReviewType>>([{detail:'',id:'',review:'',reviewer:'',title:'',url:''}]);

  async function getReviews(): Promise<void> {
    let listToDisplay: Array<ReviewType>;
    // テスト投稿のレビューを除外して、レビューを10件取得する
    // まずapiから最初の10件を取得
    const reviewList = (await fetch('https://api-for-missions-and-railways.herokuapp.com/public/books'
    , {method: 'GET'}
    ).then(res => {
      return res.json();
    })
    )
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
    // ただし、呼び出しは最大で4回までとする
    for (let i=0; i < 4; i ++) {
      if (listToDisplay.length < 10) {
        const reviewList = await fetch(`https://api-for-missions-and-railways.herokuapp.com/public/books?offset=${(i+1)*10}`
        , {method: 'GET'}
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
    </>
  )
}

export default ReviewIndex;