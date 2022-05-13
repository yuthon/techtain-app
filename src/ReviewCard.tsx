import { FC ,ReactElement, useContext, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
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

type ReviewCardProps = {
  review: ReviewType;
}

const ReviewCard: FC<ReviewCardProps> = ({ review }): ReactElement => {
  // 認証トークン
  const { userToken } = useContext(AuthorizeContext);
  // エラー
  const [deleteError, setDeleteError] = useState<boolean>(false);
  // fetchに対するresのステータス
  const [resStatus, setResStatus] = useState<number>(200);
  // リダイレクト用
  const navigate = useNavigate();
  // エラー時のメッセージ
  let ErrorAlert: ReactElement;

  // レビューを削除
  const deleteReview = async(): Promise<void> => {
    await fetch(
      `https://api-for-missions-and-railways.herokuapp.com/books/${review.id}`,
      {
        method: 'DELETE',
        headers: new Headers({ 'Authorization': `Bearer ${userToken}`})
      }
    ).then(res => {
      if (res.ok) {
        setDeleteError(false);
        setResStatus(200);
        // eslint-disable-next-line no-restricted-globals
        location.reload();
        navigate('/');
      }
      else {
        setDeleteError(true);
        if (res.status === 400) {
          setResStatus(400);
        }
        else if (res.status === 403) {
          setResStatus(403);
        }
        else if (res.status === 404) {
          setResStatus(404);
        }
        else {
          setResStatus(500);
        }
      }
    })
  };

  // エラーが起きたときコンポーネントが再レンダーされるのでエラーメッセージを出す
  if (deleteError) {
    if (resStatus === 404) {
      ErrorAlert = (
        <div id="submit-error" className="alert alert-danger mt-3 mb-0" role="alert">エラー：投稿が存在しません</div>
      )
    }
    else if (resStatus === 400 || resStatus === 403 || resStatus === 500) {
      ErrorAlert = (
        <div id="submit-error" className="alert alert-danger mt-3 mb-0" role="alert">エラーが起きました。もう一度お試しください</div>
      )
    }
  }

  return review.isMine ? (
    <>
    <div className="card review-card text-dark bg-light my-3 mx-auto">
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
            <li><p className="card-link dropdown-item m-0" onClick={()=>{deleteReview()}} style={{cursor: "pointer"}}>削除</p></li>
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
    {ErrorAlert!}
    </>
  ) : (
    <div className="card review-card text-dark bg-light my-3 mx-auto">
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
          </ul>
        </div>
      </div>
      <div className="card-body">
        <p className="card-text text-truncate text-start">{review.detail}</p>
        <p className="card-text text-truncate text-start">{review.review}</p>
        <div className="d-flex">
          <svg width="30px" height="30px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          {/* <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --> */}
            <path
              d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 128c39.77 0 72 32.24 72 72S295.8 272 256 272c-39.76 0-72-32.24-72-72S216.2 128 256 128zM256 448c-52.93 0-100.9-21.53-135.7-56.29C136.5 349.9 176.5 320 224 320h64c47.54 0 87.54 29.88 103.7 71.71C356.9 426.5 308.9 448 256 448z"
              fill="#adb5bd"
            />
          </svg>
          <p className="my-auto ms-2">{review.reviewer}</p>
        </div>
      </div>
    </div>
  )
}

export default ReviewCard;