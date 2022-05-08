import { ReactElement, useEffect, useState, useContext } from 'react';
import { AuthorizeContext } from './AuthorizeProvider';
import MyReviews from './MyReviews';
import { Link } from "react-router-dom";

type userDataType = {
  name: string
}

function Profile (): ReactElement {
  const [userName, setUserName] = useState<string>('')

  // トークンをコンテキストから取得
  const { userToken } = useContext(AuthorizeContext);

  // 認証トークンを利用してユーザ情報を取得
  async function getUser(): Promise<void> {
    const userInfo: userDataType = await fetch(`https://api-for-missions-and-railways.herokuapp.com/users`,
    {headers: new Headers({ 'Authorization': `Bearer ${userToken}`})}
    ).then(res => {
      return res.json();
    })
    setUserName(userInfo.name)
  }
  let ErrorAlert: ReactElement;

  useEffect(()=>{
    getUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <>
      <div className="mb-3">
        <div>ユーザー名</div>
        <div>{userName}</div>
        <Link to="edit">ユーザ情報編集</Link>
      </div>
      {ErrorAlert!}
      <MyReviews />
    </>
  )
}

export default Profile;