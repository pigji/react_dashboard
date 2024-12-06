import React, { useEffect, useState, useContext } from 'react'
import { ActivityInput, ActivitySectionHeader, ActivitySelect, ActivityWriteBtn, ActivityBody, ActivityFooter } from '../styles/activity.styles'
import ActivityCard from './ActivityCard'
import { Pagination } from '@mui/material'
import axios from 'axios'
import { UserContext } from '../App'

const ActivitySection = () => {
  //accessToken을 전역상태에서 현재 컴포넌트로 가져옵니다.
  const {accessToken} = useContext(UserContext);
  const cntPerPage = 4; //한 페이지당 몇개씩 보여줄지 설정
  //게시물 리스트를 담을 상태변수
  const [activityList, setActivityList] = useState([]);
  //마지막 페이지를 저장하기 위한 상태변수
  const [totalPage, setTotalPage] = useState(1);
  //현재 페이지를 저장하기 위한 상태, 기본값으로 1번째 페이지로 설정
  const [currentPage, setCurrentPage] = useState(1);

  const [order, setOrder] = useState('dateDesc'); //날짜 내림차순을 초기값으로 설정

  //검색창에 입력한 글자를 담을 상태 변수
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    //order = 정렬방법, limit = 한페이지에 보여질 카드수, page = 현재 페이지
    let tmp = async () => {
      try {
        if(accessToken === null){
          return;//토큰이 없으면 바로 종료
        }
        let res = await axios.get(`/api/activities?order=${order}&limit=${cntPerPage}&page=${currentPage}&q=${searchText}`,
          {headers: {Authorization: `Bearer ${accessToken}`}}
        )//Authorization헤더에 Bearer키워드를 붙여서 토큰을 전달하여 인증 상태를 검증하고 요청에 대한 권한을 판단
        //res.data = 서버에서 보내준 객체
        //res.data.total_cnt = 전체 게시물 겟수 => 필요한 페이지 갯수 계산
        //전체 게시물 갯수 = 10, 한페이지당 게시물 갯수 = 3,  총페이지 = 4
        //총페이지 갯수 = 올림(전체게시물갯수 / 한페이지당게시물갯수)
        setTotalPage(Math.ceil(res.data.total_cnt / cntPerPage));
        //리스트에 응답받은 데이터를 저장
        setActivityList(res.data.activityList);
      } catch (err) {
        console.log(err);
        alert('게시글을 불러오다 문제가 발생했습니다')
      }
    }
    tmp(); //함수를 실행시켜주어야 합니다
    //console.log(activityList)
  }, [currentPage, order, searchText, accessToken]); //currentPage와 order가 바꼈을때 useEffect를 다시 호출

  const onPageChange = async (e, value) => {//매개변수 두개(이벤트객체, 클릭한 값)
    setCurrentPage(value);//currentPage상태값을 클릭한 값으로 변경
  }

  const onOrderChange = (e) => {
    //선택한 옵션태그의 입력값을 order에 저장
    setOrder(e.target.value)
    //console.log(e.target.value)
  }

  const onSearchChange = (e) => {
    setSearchText(e.target.value);
  }

  return (
    <section>
      <ActivitySectionHeader>
        <ActivityInput
          onChange={onSearchChange}
          placeholder='제목으로 검색'
        />
        <ActivitySelect
          value={order}
          onChange={onOrderChange}
        >
          <option value="dateDesc">최신순</option>
          <option value="dateAsc">오래된순</option>
          <option value="like">좋아요순</option>
          <option value="view">조회수순</option>
        </ActivitySelect>
        <ActivityWriteBtn>글 쓰기</ActivityWriteBtn>
      </ActivitySectionHeader>
      <ActivityBody>
        {
          //리스트에 있는 데이터의 갯수만큼 map함수로 ActivityCard컴포넌트를 추가
          activityList.map((el) => 
            <ActivityCard 
              key={el.id}
              activity={el}
            />
          )
        }
      </ActivityBody>
      <ActivityFooter>
        {/*
          페이지 갯수를 페이지네이션의 count값으로 설정 
          현재 선택된 page를 page속성의 값으로 설정
        */}
        <Pagination 
          onChange={onPageChange}
          page={currentPage}
          count={totalPage} 
        />
      </ActivityFooter>
    </section>
  )
}

export default ActivitySection