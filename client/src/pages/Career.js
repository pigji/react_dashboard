import React from 'react'
import { Title } from '../styles/career.styles';
//경력을 입력하는 테이블과 입력된 경력을 보여줄 컴포넌트
import CareerViewTable from '../components/CareerViewTable'
import LayoutPage from '../components/LayoutPage';

const Career = () => {
  return (
    <LayoutPage>
      {/*LayoutPage의 자식 컴포넌트로 전달 */}
      <Title>나의 경력을 관리하세요</Title>
      <p>회사, 직위, 일자를 입력한 후 경력을 추가해 보세요!</p>
      <CareerViewTable />
    </LayoutPage>
  )
}

export default Career