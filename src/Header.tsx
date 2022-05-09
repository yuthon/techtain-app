import { ReactElement, useContext, useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { AuthorizeContext } from './AuthorizeProvider';
import bookLogo from './bookLogo.svg';
import userIcon from './userIcon.svg';

const Header = (): ReactElement => {
  const authContext = useContext(AuthorizeContext);

  const [userName, setUserName] = useState<string>('')

  // 認証トークンを利用してユーザ情報を取得
  async function getUser(): Promise<void> {
    const userInfo: {name: string} = await fetch(`https://api-for-missions-and-railways.herokuapp.com/users`,
    {headers: new Headers({ 'Authorization': `Bearer ${authContext.userToken}`})}
    ).then(res => {
      return res.json();
    })
    setUserName(userInfo.name)
  }

  const logOut = () => {
    localStorage.removeItem('v_|2Q)iA~*rn%');
    authContext.setUserToken('');
    authContext.setIsAuthorized(false);
  };

  useEffect(()=>{
    getUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  })

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
                  <Link to="/">レビュー一覧</Link>
                </li>
                <li className="nav-item my-auto mx-3">
                  <Link to="/new">レビュー投稿</Link>
                </li>
                <li className="nav-item my-auto mx-3">
                  <Link onClick={()=>{logOut()}} to="/login">ログアウト</Link>
                </li>
                <li className="nav-item">
                  <Link className="d-flex" to="/profile" >
                    <img src={userIcon} className="userIcon my-auto" alt="logo" />
                    <span className="userName">{userName}</span>
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
                  <Link to="/signup">登録</Link>
                </li>
                <li className="nav-item my-auto mx-3">
                  <Link to="/login">ログイン</Link>
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