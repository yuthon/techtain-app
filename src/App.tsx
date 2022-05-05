import { ReactElement, useState, useContext, useEffect } from 'react';
import logo from './logo.svg';
import bookLogo from './bookLogo.svg';
import { Routes, Route, Link, Navigate } from "react-router-dom";
import './App.css';
import SignUp from './SignUp';
import LogIn from './LogIn';
import ReviewIndex from './ReviewIndex';
import MyReviewIndex from './MyReviewIndex';
import { AuthorizeProvider } from './AuthorizeProvider';
import { AuthorizeContext } from './AuthorizeProvider';
import SideBar from './Sidebar';
import Profile from './Profile';

function App(): ReactElement {
  // localStorage.removeItem('v_|2Q)iA~*rn%');
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
    <header className="App-header">
      <nav className="navbar title">
        <Link className="navbar-brand d-flex" to="/" >
          <img src={bookLogo} className="logo my-auto" alt="logo" />
          <h1 className="h3 text-white my-auto">Book Review</h1>
        </Link>
      </nav>
    </header>
    <div className="text-center d-flex">
      <SideBar />
      <div className="container" id="main">
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="about" element={<About />}/>
          <Route path="signup" element={ authContext.isAuthorized ? <Navigate to="/"/> : <SignUp />}/>
          <Route path="login" element={ authContext.isAuthorized ? <Navigate to="/"/> : <LogIn />}/>
          <Route path="review-index" element={<ReviewIndex />}/>
          <Route path="myreview-index" element={ !authContext.isAuthorized ? <Navigate to="/"/> : <MyReviewIndex />}/>
          <Route path="profile" element={ !authContext.isAuthorized ? <Navigate to="/"/> : <Profile />}/>
        </Routes>
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
