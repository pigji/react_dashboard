import React, { useState, useEffect, useContext } from 'react'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { BoardContent, BoardDetailWrap, BoardInfoWrap, BoardTitle, WriteBtn } from '../styles/activityDetail.styles';
import { UserContext } from '../App';
import axios from 'axios';
import formatDateKorean from '../utils/formatDate';

const ActivityDetailSection = (props) => {
  const [isLiked, setIsLiked] = useState(false); //좋아요 여부
  const { accessToken } = useContext(UserContext);

  //게시글 정보 = 한번에 몰아서 객체로 저장
  const [activity, setActivity] = useState({
    id:0,
    title: '제목이 올자리',
    content: '내용이 올자리',
    writer_email: '이메일이 올자리',
    created_date: '작성일이 올자리',
    updated_date: '수정일이 올자리',
    activity_view: 0,
    activity_like: 0,
    liked: '',
    img_url: []
  })

  useEffect(() => {
    let tmp = async () => {
      if(accessToken === null) return;
      let res = await axios.get(`/api/activities/${props.activityId}`,
        {headers: {Authorization: `Bearer ${accessToken}`}}
      )
      //console.log(res.data)
      //받아온 데이터를 상태변수에 저장
      setActivity(res.data)
    }
    tmp();
  },[props.activityId, accessToken])

  //좋아요 버튼을 클릭했을때 실행되는 함수
  const onLikeClick = async () => {
    if(activity.liked === 'yes'){//현재 사용자가 좋아요를 눌렀으면 구문 실행
      try{
        await axios.delete('/api/like', {
          data: {id: activity.id},
          headers: {Authorization: `Bearer ${accessToken}`}
        })
        //activity상태 업데이트
        setActivity({...activity, liked:'no', activity_like: activity.activity_like - 1})
      }catch(err){
        console.log(err)
        alert('좋아요 현재 수정 불가')
      }
    }else{//좋아요가 안눌려 있으면 구문 실행
      try{
        await axios.post('/api/like', 
          {id:activity.id},
          {headers:{Authorization: `Bearer ${accessToken}`}}
        );
        //activity상태 업데이트
        setActivity({...activity, liked:'yes', activity_like: activity.activity_like + 1})
      }catch(err){
        console.log(err)
        alert('좋아요 오류')
      }
    }
  }

  return (
    <section>
      <BoardDetailWrap>
        <BoardTitle>
          {activity.title}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span>좋아요:{activity.activity_like}</span>
            <span onClick={onLikeClick}>
              {activity.liked === 'yes' ? <FavoriteIcon style={{ color: 'red' }} /> : <FavoriteBorderIcon />}
            </span>
          </div>
        </BoardTitle>
        <BoardInfoWrap>
          <p>작성자</p>
          <p>{activity?.writer_email}</p>
          <p>조회수</p>
          <p>{activity?.activity_view}</p>
        </BoardInfoWrap>
        <BoardInfoWrap>
          <p>작성일자</p>
          <p>{activity?.created_date && formatDateKorean(activity.created_date)}</p>
          <p>수정일자</p>
          <p>{activity?.updated_date && formatDateKorean(activity.updated_date)}</p>
        </BoardInfoWrap>
        <BoardContent>
          {activity?.img_url.map((img) => 
            <div>
              <img style={{width: '100%'}} src={img} alt='이미지'/>
            </div>
          )}
          {activity?.content}
        </BoardContent>
        <div style={{
          alignSelf: 'flex-end',
          display: 'flex',
          columnGap: '10px'
        }}>
          <WriteBtn>수정</WriteBtn>
          <WriteBtn style={{ backgroundColor: 'red' }}>삭제</WriteBtn>
        </div>
      </BoardDetailWrap>
    </section>
  )
}

export default ActivityDetailSection