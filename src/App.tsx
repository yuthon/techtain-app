import { ReactElement, useContext } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import SignUp from './SignUp';
import LogIn from './LogIn';
import ReviewIndexAuth from './ReviewIndexAuth';
import  AuthorizeProvider  from './AuthorizeProvider';
import { AuthorizeContext } from './AuthorizeProvider';
import Profile from './Profile';
import NewReview from './NewReview';
import ReviewDetail from './ReviewDetail';
import ReviewEdit from './ReviewEdit';
import Header from './Header';
import EditProfile from './EditProfile';

function App(): ReactElement {
  return (
    <>
    <div className="App">
      <AuthorizeProvider>
        <Main />
      </AuthorizeProvider>
    </div>
    </>
  );
}

function Main(): ReactElement {
  
  const authContext = useContext(AuthorizeContext);

  return (
    <>
    <Header />
    <Routes>
      <Route path="signup" element={ authContext.isAuthorized ? <Navigate to="/"/> : <SignUp />}/>
      <Route path="login" element={ authContext.isAuthorized ? <Navigate to="/"/> : <LogIn />}/>
      {/* ログインしていれば認証付きの一覧ページに、していなければ認証なしの一覧ページに */}
      <Route path="/" element={ !authContext.isAuthorized ? <Navigate to="/login"/> : <ReviewIndexAuth />}/>
      <Route path="profile" element={ !authContext.isAuthorized ? <Navigate to="/login"/> : <Profile />}/>
      <Route path="profile/edit" element={ !authContext.isAuthorized ? <Navigate to="/login"/> : <EditProfile />}/>
      <Route path="new" element={ !authContext.isAuthorized ? <Navigate to="/login"/> : <NewReview />}/>
      <Route path="detail/:bookId" element={ !authContext.isAuthorized ? <Navigate to="/login"/> : <ReviewDetail />}/>
      <Route path="edit/:bookId" element={ !authContext.isAuthorized ? <Navigate to="/login"/> : <ReviewEdit />}/>
    </Routes>
    </>
  )
}

export default App;
