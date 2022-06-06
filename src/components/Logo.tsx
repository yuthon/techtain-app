import { FC, ReactElement } from 'react';
import bookLogo from '../assets/bookLogo.svg';

interface LogoProps {
  size: number
}

const Logo: FC<LogoProps> = ({ size }): ReactElement => {
  return (
    <div className="d-flex flex-nowrap justify-content-center">
      <img src={bookLogo} className="my-auto" style={{ width: `${size * 15 / 16}rem`, height: `${size * 15 / 16}rem` }} alt="logo" />
      <h1 className="text-white my-auto text-nowrap" style={{ fontSize: `${size}rem`, marginLeft: `${size / 8}rem` }}>Book Review</h1>
    </div>
  )
}

export default Logo;