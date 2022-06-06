import { useLocation } from "react-router-dom";
import bg_0 from '../assets/bg_6.jpg';
import bg_1 from '../assets/bg_5.jpg'

// 表示しているページの背景画像のpathを返す
export const useBackGround = () => {
  let bgPath: string | null = null;
  // ユーザーのページ遷移を検知
  const location = useLocation();
  // ページごとの背景設定
  const bgSetting = [
    { path: '/signup', bg: bg_0 },
    { path: '/login', bg: bg_0 },
    { path: '/', bg: bg_1 },
    { path: '/profile', bg: bg_1 },
    { path: '/new', bg: bg_1 },
    { path: '/detail/:bookId', bg: bg_1 },
    { path: '/edit/:bookId', bg: bg_1 },
    { path: '/search', bg: bg_1 },
  ]

  for (let i = 0; i < bgSetting.length; i++) {
    if (location.pathname === bgSetting[i].path) {
      bgPath = bgSetting[i].bg;
      break
    }
  }

  return bgPath ? bgPath : bg_1
}