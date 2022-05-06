import { ReactElement, useEffect, useState, useContext } from 'react';
import { AuthorizeContext } from './AuthorizeProvider';
import { useParams } from "react-router-dom";

type detailType = {
  id: string,
  title: string,
  url: string,
  detail: string,
  review: string,
  reviewer: string,
  isMine: boolean
}

const ReviewDetail = ():ReactElement => {

  const { userToken } = useContext(AuthorizeContext);

  let { bookId } = useParams<string>();

  const [reviewDetail, setReviewDetail] = useState<detailType>({
    id:'',title:'',url:'',detail:'',review:'',reviewer:'',isMine:false
  });

  async function getDetail() {
    const review = await fetch(`https://api-for-missions-and-railways.herokuapp.com/books/${bookId}`
    , {headers: new Headers({ 'Authorization': `Bearer ${userToken}`})}
    ).then(res => {
      return res.json();
    })
    
    setReviewDetail(review);
    if (await review) {
      // console.log(await reviewList)
    } else {
      if (await review.ErrorCode) {
        if (await review.ErrorCode === 400) {
          console.log(await review.ErrorMessageJP)
        }
        else if (await review.ErrorCode === 401) {
          console.log(await review.ErrorMessageJP)
        }
        else if (await review.ErrorCode === 500) {
          console.log(await review.ErrorMessageJP)
        }
      }
    }
  }

  useEffect(()=>{
    getDetail();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return reviewDetail.isMine ? (
    <div className="">
      <h4>{reviewDetail.title}</h4>
      <p>{reviewDetail.detail}</p>
      <p>{reviewDetail.review}</p>
      <p>{reviewDetail.reviewer}</p>
      <a href={reviewDetail.url}>書籍へのリンク</a>
      <a href={`/edit/${reviewDetail.id}`}>レビューの編集</a>
    </div>
  ) : (
    <div className="">
      <h4>{reviewDetail.title}</h4>
      <p>{reviewDetail.detail}</p>
      <p>{reviewDetail.review}</p>
      <p>{reviewDetail.reviewer}</p>
      <a href={reviewDetail.url}>書籍へのリンク</a>
    </div>
  )
}

export default ReviewDetail;