import { ReactElement, FC } from 'react';
import { useBackGround } from '../hooks/useBackGround';

interface PageContainerProps {
  children: ReactElement;
  id: string;
}

const PageContainer: FC<PageContainerProps> = ({ children, id }) => {
  const bg = useBackGround();

  return (
    <div id={id}>
      <img className="bg-books fixed-top" src={bg} alt="背景" />
      <div className="container-fuild container-lg">
        {children}
      </div>
    </div>
  )
}

export default PageContainer;