import { ReactElement, useContext, useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import './App.css';
import SignUp from './SignUp';
import LogIn from './LogIn';
import ReviewIndexAuth from './ReviewIndex';
import { AuthorizeContext } from './AuthorizeProvider';
import Profile from './Profile';
import NewReview from './NewReview';
import ReviewDetail from './ReviewDetail';
import ReviewEdit from './ReviewEdit';
import Header from './Header';
import SearchSection from './SearchSection';

const Main = (): ReactElement => {
  // 認証コンテキスト
  const authContext = useContext(AuthorizeContext);
  // ユーザーネーム
  const [userName, setUserName] = useState<string | null>(null);
  // エラー
  const [isError, setIsError] = useState<boolean>(false);

  // 認証トークンを利用してユーザ情報を取得
  async function getUser(): Promise<void> {
    const response: {name: string} = await fetch(
      `https://api-for-missions-and-railways.herokuapp.com/users`,
      {headers: new Headers({ 'Authorization': `Bearer ${authContext.userToken}`})}
    ).then(res => {
      if (res.ok) {
        setIsError(false);
        return res.json();
      }
      else {
        setIsError(true);
      }
    });

    if (response.name) {
      setUserName(response.name);
    }
  };

  // ログインしたらユーザー情報を取得
  useEffect(()=>{
    if (authContext.isAuthorized) {
      getUser();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[authContext.isAuthorized])

  return isError ? (
    <>
      <Header userName={userName} />
      <div className="container pt-5">
        <div className="alert alert-warning mt-5" role="alert">
          エラーが起きました。しばらくしてからもう一度お試しください
        </div>
      </div>
    </>
  ) : (
    <>
      <Header userName={userName} />
      <Routes>
        <Route path="signup" element={ authContext.isAuthorized ? <Navigate to="/"/> : <SignUp />}/>
        <Route path="login" element={ authContext.isAuthorized ? <Navigate to="/"/> : <LogIn />}/>
        {/* ログインしていれば認証付きの一覧ページに、していなければ認証なしの一覧ページに */}
        <Route path="/" element={ !authContext.isAuthorized ? <Navigate to="/login"/> : <ReviewIndexAuth />}/>
        <Route
          path="profile"
          element={
            !authContext.isAuthorized ? <Navigate to="/login"/> : <Profile userName={userName} setUserName={setUserName} />
          }
        />
        <Route path="new" element={ !authContext.isAuthorized ? <Navigate to="/login"/> : <NewReview />}/>
        <Route path="detail/:bookId" element={ !authContext.isAuthorized ? <Navigate to="/login"/> : <ReviewDetail />}/>
        <Route path="edit/:bookId" element={ !authContext.isAuthorized ? <Navigate to="/login"/> : <ReviewEdit />}/>
        <Route path="search" element={!authContext.isAuthorized ? <Navigate to="/login"/> : <SearchSection />} />
      </Routes>
    </>
  )
}

export default Main;