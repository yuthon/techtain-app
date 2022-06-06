import { ReactElement, useContext, useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
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

const Main = (): ReactElement => {
  // 認証コンテキスト
  const authContext = useContext(AuthorizeContext);
  // ユーザーネーム
  const [userName, setUserName] = useState<string | null>(null);
  // 特殊なエラー
  const [isError, setIsError] = useState<boolean>(false);
  // ユーザーのページ遷移を検知
  const location = useLocation();

  // 認証トークンを利用してユーザ情報を取得
  async function getUser(): Promise<void> {
    const response: { name: string } = await fetch(
      `https://api-for-missions-and-railways.herokuapp.com/users`,
      { headers: new Headers({ 'Authorization': `Bearer ${authContext.userToken}` }) }
    ).then(res => {
      if (res.ok) {
        return res.json();
      } else {
        if (res.status === 400) {
          throw new Error(res.statusText);
        }
        else if (res.status === 401) {
          throw new Error(res.statusText);
        }
        else if (res.status === 403) {
          throw new Error(res.statusText);
        }
        else if (res.status === 500) {
          throw new Error(res.statusText);
        }
        // 506番など特殊なエラー
        else {
          throw new Error(res.statusText);
        }
      }
    }).catch(error => {
      localStorage.removeItem('v_|2Q)iA~*rn%');
      authContext.setUserToken(null);
      authContext.setIsAuthorized(false);
      setIsError(true);
    });

    if (response) {
      setUserName(response.name);
    }
  };

  // ログインしたらユーザー情報を取得
  useEffect(() => {
    if (authContext.isAuthorized) {
      getUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authContext.isAuthorized])

  useEffect(() => {
    // 特殊なエラーの処理後は必ずログイン画面にリダイレクトするのでそこから別画面に遷移すれば消す
    if (location.pathname !== '/login') {
      setIsError(false);
    }
  }, [location])

  return (
    <>
      <Header userName={userName} />
      {isError ? (
        <div className="alert alert-warning mt-3 mx-5" role="alert">
          エラーが発生しました。しばらくしても改善されない場合はお手数ですが運営までお問い合わせください
        </div>
      ) : (null)}
      <Routes>
        <Route path="signup" element={authContext.isAuthorized ? <Navigate to="/" /> : <SignUp />} />
        <Route path="login" element={authContext.isAuthorized ? <Navigate to="/" /> : <LogIn />} />
        {/* ログインしていれば認証付きの一覧ページに、していなければ認証なしの一覧ページに */}
        <Route path="/" element={!authContext.isAuthorized ? <Navigate to="/login" /> : <ReviewIndex setIsError={setIsError} />} />
        <Route
          path="profile"
          element={
            !authContext.isAuthorized ? <Navigate to="/login" /> : <Profile userName={userName} setUserName={setUserName} setIsError={setIsError} />
          }
        />
        <Route path="new" element={!authContext.isAuthorized ? <Navigate to="/login" /> : <NewReview setIsError={setIsError} />} />
        <Route path="detail/:bookId" element={!authContext.isAuthorized ? <Navigate to="/login" /> : <ReviewDetail setIsError={setIsError} />} />
        <Route path="edit/:bookId" element={!authContext.isAuthorized ? <Navigate to="/login" /> : <ReviewEdit setIsError={setIsError} />} />
        <Route path="search" element={!authContext.isAuthorized ? <Navigate to="/login" /> : <SearchSection setIsError={setIsError} />} />
      </Routes>
    </>
  )
}

export default Main;