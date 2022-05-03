import { ReactElement, useEffect, useState } from 'react';
import { Link } from "react-router-dom";

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
    const reviewList = (await fetch("https://api-for-missions-and-railways.herokuapp.com/public/books"
    , {method: 'GET'}
    ).then(res => {
      return res.json();
    })
    )
    setReViews(reviewList);
    if (await reviewList) {
      console.log(await reviewList)
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
            <p>{review.title}</p>
            <p>{review.detail}</p>
            <p>{review.review}</p>
            <p>{review.reviewer}</p>
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

export default ReviewIndex;