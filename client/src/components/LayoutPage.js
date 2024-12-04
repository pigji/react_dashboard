import React from 'react'
import { Main, MainWrapper, Wrapper } from '../styles/layout.styles'
import HeaderPage from './HeaderPage'
import FooterPage from './FooterPage'
import SidebarPage from './SidebarPage'

//children은 자식컴포넌트를 뜻함
const LayoutPage = ({children}) => {
  return (
    <Wrapper>
      <SidebarPage />
      <MainWrapper>
        <HeaderPage />
        <Main>
          {children}
        </Main>
        <FooterPage />
      </MainWrapper>
    </Wrapper>
  )
}

export default LayoutPage