import React, {useState} from 'react'
import { Main, MainWrapper, Wrapper } from '../styles/layout.styles'
import HeaderPage from './HeaderPage'
import FooterPage from './FooterPage'
import SidebarPage from './SidebarPage'

//children은 자식컴포넌트를 뜻함
const LayoutPage = (props) => {
  //사이드바가 열려있는지 닫혀있는지 확인하는 상태변수
  const [isOpen, setIsOpen] = useState(true);

  return (
    /*스타일 컴포넌트로 isOpen상태를 전달 */
    <Wrapper isOpen={isOpen}>
      {/*부모컴포넌트에서 전달받은 target속성을 자식컴포넌트로 전달 */}
      <SidebarPage isOpen={isOpen} target={props.target} />
      <MainWrapper>
        {/*헤더로 setIsOpen설정 함수 전달 => 헤더에있는 토글 아이콘을 클릭하면 isOpen의 값을 변경 */}
        <HeaderPage isOpen={isOpen} setIsOpen={setIsOpen} />
        <Main>
          {props.children}
        </Main>
        <FooterPage />
      </MainWrapper>
    </Wrapper>
  )
}

export default LayoutPage