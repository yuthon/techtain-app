import { FC, ReactElement, useContext } from 'react';
import { Link } from "react-router-dom";
import { AuthorizeContext } from './AuthorizeProvider';
import bookLogo from './bookLogo.svg';
import userIcon from './userIcon.svg';

type HeaderProps = {
  userName: string | null;
}

const Header: FC<HeaderProps> = ({ userName }): ReactElement => {

  const authContext = useContext(AuthorizeContext);

  const logOut = (): void => {
    localStorage.removeItem('v_|2Q)iA~*rn%');
    authContext.setUserToken(null);
    authContext.setIsAuthorized(false);
  };

  return authContext.isAuthorized ? (
    <>
      <header className="App-header fixed-top">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <Link className="navbar-brand d-flex" to="/" >
              <img src={bookLogo} className="logo my-auto" alt="logo" />
              <h1 className="h3 text-white my-auto">Book Review</h1>
            </Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse menu" id="navbarSupportedContent">
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                <li className="nav-item my-auto mx-3">
                  <Link className="header-link" to="/">レビュー一覧</Link>
                </li>
                <li className="nav-item my-auto mx-3">
                  <Link className="header-link" to="/new">レビュー投稿</Link>
                </li>
                <li className="nav-item my-auto mx-3">
                  <Link className="header-link" onClick={()=>{logOut()}} to="/login">ログアウト</Link>
                </li>
                <li className="nav-item">
                  <Link to="/profile" >
                    <div className="d-flex flex-nowrap" id="header-userLink">
                      <img src={userIcon} className="userIcon my-auto" alt="logo" />
                      <span className="userName">{userName}</span>
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </>
  ): (
    <>
      <header className="App-header">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <Link className="navbar-brand d-flex" to="/" >
              <img src={bookLogo} className="logo my-auto" alt="logo" />
              <h1 className="h3 text-white my-auto">Book Review</h1>
            </Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse menu" id="navbarSupportedContent">
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                <li className="nav-item my-auto mx-3">
                  <Link className="header-link" to="/signup">登録</Link>
                </li>
                <li className="nav-item my-auto mx-3">
                  <Link className="header-link" to="/login">ログイン</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </>
  )
}

export default Header;