import {useContext, useEffect} from 'react';
import { UserContext } from '../App';
import { useNavigate } from 'react-router-dom';

//accessToken이 있는지 없는지 검사하는 hook함수
export const useAuth = () => { //다른데서 사용가능하게 export해줌
  //전역 state변수 가져오기
  const {accessToken, setAccessToken} = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    //로그인이 안된 상태 localStorage의 accessToken = null
    if(localStorage.getItem('accessToken') === null){
      alert('로그인이 필요한 페이지 입니다!');//경고창 표시
      navigate('/login', {replace: true});//로그인 페이지로 이동
      return; //콜백함수 종료
    }

    //로그인은 되었으나 새로고침한 상태 accessToken있음
    //전역 상태변수 accessToken = null
    if(accessToken === null){
      setAccessToken(localStorage.getItem('accessToken'))//전역상태변수 accessToken에 로컬스토레이지에 있는 토큰을 넣어줌
      return;
    }
    //로그인 되었고, 새로고침도 안함(로컬스토레이지에 토큰있고, 전역상태변수에도 토큰이 있는 상태)
  },[accessToken, setAccessToken, navigate]) //accessToken, setAccessToken, navigate가 바뀌면 실행시켜줘
}