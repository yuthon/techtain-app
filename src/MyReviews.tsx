import { ReactElement, useEffect, useState, useContext } from 'react';
import { AuthorizeContext } from './AuthorizeProvider';
import { Link } from "react-router-dom";

type ReviewType = {
  detail: string,
  id: string,
  isMine?: boolean,
  review: string,
  reviewer: string,
  title: string,
  url: string,
}

function MyReviews (): ReactElement {
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
        // 詳細が25文字以上
        review.detail.length > 25 &&
        // レビューが5文字以上
        review.review.length > 4 &&
        // 自分のレビューかどうか
        review.isMine
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
            // 詳細が25文字以上
            review.detail.length > 25 &&
            // レビューが5文字以上
            review.review.length > 4 &&
            // 自分のレビューかどうか
            review.isMine
          )
        })
        // 同一の書籍に対するレビューを除外する
        list = list.filter((review: ReviewType, index, self)=>{
          const titleList: Array<string> = self.map(review => review.title);
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
      <h2 className="text-white">あなたが投稿したレビュー</h2>
      {reviews!.map(
        (review: ReviewType, index: number): ReactElement | null =>
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
      )}
    </>
  )
}

export default MyReviews;