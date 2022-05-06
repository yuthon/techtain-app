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
      <header className="App-header">
        <nav className="navbar title">
          <Link className="navbar-brand d-flex" to="/" >
            <img src={bookLogo} className="logo my-auto" alt="logo" />
            <h1 className="h3 text-white my-auto">Book Review</h1>
          </Link>
        </nav>
        <img src={userIcon} className="logo my-auto" alt="logo" />
      </header>
    </>
  ): (
    <>
      <header className="App-header">
        <nav className="navbar title">
          <Link className="navbar-brand d-flex" to="/" >
            <img src={bookLogo} className="logo my-auto" alt="logo" />
            <h1 className="h3 text-white my-auto">Book Review</h1>
          </Link>
        </nav>
      </header>
    </>
  )
}

export default Header;