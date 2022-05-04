import { ReactElement } from 'react';
import logo from './logo.svg';
import { Routes, Route, Link } from "react-router-dom";
import './App.css';
import SignUp from './SignUp';
import LogIn from './LogIn';
import ReviewIndex from './ReviewIndex';
import MyReviewIndex from './MyReviewIndex';
import { AuthorizeProvider } from './AuthorizeProvider';

function App(): ReactElement {
  return (
    <div className="App">
      <AuthorizeProvider>
      <header className="App-header">
        <h1>Book Review App</h1>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="about" element={<About />}/>
          <Route path="signup" element={<SignUp />}/>
          <Route path="login" element={<LogIn />}/>
          <Route path="review-index" element={<ReviewIndex />}/>
          <Route path="myreview-index" element={<MyReviewIndex />}/>
        </Routes>
      </main>
      </AuthorizeProvider>
    </div>
  );
}

function Home(): ReactElement {
  return (
    <>
      <main>
        <img src={logo} className="App-logo" alt="logo" />
        <h2>Welcome to the homepage!</h2>
        <p>You can do this, I believe in you.</p>
      </main>
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
        <Link to="/review-index">レビュー一覧</Link>
      </nav>
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
      <nav>
        <Link to="/">Home</Link>
      </nav>
      <nav>
        <Link to="/signup">SignUp</Link>
      </nav>
      <nav>
        <Link to="/login">Log In</Link>
      </nav>
      <nav>
        <Link to="/review-index">レビュー一覧</Link>
      </nav>
    </>
  );
}

export default App;
