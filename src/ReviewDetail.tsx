import { ReactElement, useEffect, useState, useContext } from 'react';
import { AuthorizeContext } from './AuthorizeProvider';
import { useParams, Link } from "react-router-dom";


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
    <div className="reviewPage-bg" id="reviewDetailPage">
        <div className="container-fuild container-lg">
          <div className="card text-dark bg-light mb-3 mx-auto"> 
          <div className="card-header d-flex justify-content-between">
            <h5 className="fw-bold text-start my-auto">{reviewDetail.title}</h5>
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
                <li><a className="dropdown-item card-link" href={reviewDetail.url}>書籍へのリンク</a></li>
                <li><Link className="card-link dropdown-item" to={`/edit/${reviewDetail.id}`}>編集</Link></li>
              </ul>
            </div>
          </div>
          <div className="card-body">
            <p className="card-text text-truncate text-start">{reviewDetail.detail}</p>
            <p className="card-text text-truncate text-start">{reviewDetail.review}</p>
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
                  <p className="my-auto ms-2 username-link">{reviewDetail.reviewer}</p>
                </Link>
              </div>
            </div>
        </div>
        </div>
        </div>
      ) : (
        <div className="reviewPage-bg" id="reviewDetailPage">
        <div className="container-fuild container-lg">
        <div className="card text-dark bg-light mb-3 mx-auto">
          <div className="card-header d-flex justify-content-between">
            <h5 className="fw-bold text-start my-auto">{reviewDetail.title}</h5>
            <div className="dropdown">
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
                <li><a className="dropdown-item card-link" href={reviewDetail.url}>書籍へのリンク</a></li>
              </ul>
            </div>
          </div>
          <div className="card-body">
            <p className="card-text text-truncate text-start">{reviewDetail.detail}</p>
            <p className="card-text text-truncate text-start">{reviewDetail.review}</p>
            <div className="d-flex">
              <svg width="30px" height="30px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              {/* <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --> */}
                <path
                  d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 128c39.77 0 72 32.24 72 72S295.8 272 256 272c-39.76 0-72-32.24-72-72S216.2 128 256 128zM256 448c-52.93 0-100.9-21.53-135.7-56.29C136.5 349.9 176.5 320 224 320h64c47.54 0 87.54 29.88 103.7 71.71C356.9 426.5 308.9 448 256 448z"
                  fill="#adb5bd"
                />
              </svg>
              <p className="my-auto ms-2">{reviewDetail.reviewer}</p>
            </div>
          </div>
        </div>
        </div>
        </div>
  )
}

export default ReviewDetail;