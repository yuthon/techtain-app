import { ReactElement, useContext } from 'react';
import logo from './logo.svg';
import { Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import SignUp from './SignUp';
import LogIn from './LogIn';
import ReviewIndex from './ReviewIndex';
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
    <div className="text-center d-flex">
      <div id="bg-color">
      <div className="container" id="main">
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="about" element={<About />}/>
          <Route path="signup" element={ authContext.isAuthorized ? <Navigate to="/"/> : <SignUp />}/>
          <Route path="login" element={ authContext.isAuthorized ? <Navigate to="/"/> : <LogIn />}/>
          {/* ログインしていれば認証付きの一覧ページに、していなければ認証なしの一覧ページに */}
          <Route path="review-index" element={ !authContext.isAuthorized ? <ReviewIndex /> : <ReviewIndexAuth />}/>
          <Route path="profile" element={ !authContext.isAuthorized ? <Navigate to="/"/> : <Profile />}/>
          <Route path="profile/edit" element={ !authContext.isAuthorized ? <Navigate to="/"/> : <EditProfile />}/>
          <Route path="new" element={ !authContext.isAuthorized ? <Navigate to="/"/> : <NewReview />}/>
          <Route path="detail/:bookId" element={ !authContext.isAuthorized ? <Navigate to="/login"/> : <ReviewDetail />}/>
          <Route path="edit/:bookId" element={ !authContext.isAuthorized ? <Navigate to="/login"/> : <ReviewEdit />}/>
        </Routes>
      </div>
      </div>
    </div>
    </>
  )
}

function Home(): ReactElement {
  return (
    <>
      <main>
        <img src={logo} className="App-logo" alt="logo" />
        <h2>Welcome to the homepage!</h2>
        <p>You can do this, I believe in you.</p>
      </main>
    </>
  );
}

function About(): ReactElement {
  return (
    <>
      <main>
        <h2>Who are we?</h2>
        <p>
          That feels like an existential question, don't you
          think?
        </p>
      </main>
    </>
  );
}

export default App;
