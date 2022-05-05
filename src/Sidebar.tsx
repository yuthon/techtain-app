import { ReactElement, useContext, useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import bookLogo from './bookLogo.svg';
import { AuthorizeContext } from './AuthorizeProvider';

type userDataType = {
  name: string
}

function SideBar(): ReactElement {

  const authContext = useContext(AuthorizeContext);

  const [userName, setUserName] = useState<string>('')

  let sidebar: ReactElement; 
  // 認証トークンを利用してユーザ情報を取得
  async function getUser(): Promise<void> {
    const userInfo: userDataType = await fetch(`https://api-for-missions-and-railways.herokuapp.com/users`,
    {headers: new Headers({ 'Authorization': `Bearer ${authContext.userToken}`})}
    ).then(res => {
      return res.json();
    })
    setUserName(userInfo.name)
  }

  const logOut = () => {
    localStorage.removeItem('v_|2Q)iA~*rn%');
    authContext.setUserToken('');
    authContext.setIsAuthrized(false);
  };

  useEffect(()=>{
    getUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  })

  // ログイン済かどうかで表示する内容を変える
  if (authContext.isAuthorized) {
    sidebar = (
      <div className="" id="sidebar">
        <div className="text-white">
          {userName}  
        </div>
        <nav>
          <Link to="/about">About</Link>
        </nav>
        <nav>
          <Link to="/review-index">レビュー一覧</Link>
        </nav>
        <nav>
          <Link to="/myreview-index">あなたのレビュー一覧</Link>
        </nav>
        <nav>
          <Link to="/profile">ユーザ情報編集</Link>
        </nav>
        <nav>
          <Link onClick={()=>{logOut()}} to="/login">ログアウト</Link>
        </nav>
      </div>
    )
  } else {
    sidebar = (
      <div className="" id="sidebar">
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
    </div>
    )
  }

  return (
    <>
    {sidebar}
    </>
  )
}

export default SideBar