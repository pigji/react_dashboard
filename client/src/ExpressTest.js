import React from 'react'
//promise API를 활용하는 HTTP 비동기 통신 라이브러리 입니다.
import axios from 'axios';

const ExpressTest = () => {
  const onExpressClick = () => {
    //axios라이브러리를 활용하여 엔드포인트 /api로 get요청
    axios.get('/api')
      .then((res) => {//통신 성공시 콘솔에 응답받은 데이터를 출력
        console.log('success res', res);
      }).catch((err) => {//통신 실패시 콘솔에 에러객체를 출력
        console.log('fail err', err)
      })
  }
  return (
    <>
      <h1>express test page</h1>
      <button onClick={onExpressClick}>
        button
      </button>
    </>
  )
}

export default ExpressTest