import { ReactElement, useContext, useState } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import SignUp from '../pages/SignUp';
import LogIn from '../pages/LogIn';
import ReviewIndex from '../pages/ReviewIndex';
import { AuthorizeContext } from './AuthorizeProvider';
import Profile from '../pages/Profile';
import NewReview from '../pages/NewReview';
import ReviewDetail from '../pages/ReviewDetail';
import ReviewEdit from '../pages/ReviewEdit';
import Header from '../UI/Header';
import SearchSection from '../pages/SearchSection';
import { useSelector } from '../redux/store/store';

const Main = (): ReactElement => {
  // ユーザーネーム
  const [userName, setUserName] = useState<string | null>(null);
  // 特殊なエラー
  const [isError, setIsError] = useState<boolean>(false);
  const isAuthorized = useSelector(state => state.authorize.isAuthorized);

  return (
    <>
      <Header userName={userName} />
      {isError ? (
        <div className="alert alert-warning mt-3 mx-5" role="alert">
          エラーが発生しました。しばらくしても改善されない場合はお手数ですが運営までお問い合わせください
        </div>
      ) : (null)}
      <Routes>
        <Route path="signup" element={isAuthorized ? <Navigate to="/" /> : <SignUp />} />
        <Route path="login" element={isAuthorized ? <Navigate to="/" /> : <LogIn />} />
        {/* ログインしていれば認証付きの一覧ページに、していなければ認証なしの一覧ページに */}
        <Route path="/" element={!isAuthorized ? <Navigate to="/login" /> : <ReviewIndex setIsError={setIsError} />} />
        <Route
          path="profile"
          element={
            !isAuthorized ? <Navigate to="/login" /> : <Profile userName={userName} setUserName={setUserName} setIsError={setIsError} />
          }
        />
        <Route path="new" element={!isAuthorized ? <Navigate to="/login" /> : <NewReview setIsError={setIsError} />} />
        <Route path="detail/:bookId" element={!isAuthorized ? <Navigate to="/login" /> : <ReviewDetail setIsError={setIsError} />} />
        <Route path="edit/:bookId" element={!isAuthorized ? <Navigate to="/login" /> : <ReviewEdit setIsError={setIsError} />} />
        <Route path="search" element={!isAuthorized ? <Navigate to="/login" /> : <SearchSection setIsError={setIsError} />} />
      </Routes>
    </>
  )
}

export default Main;