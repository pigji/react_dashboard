import React, {useState, useContext} from 'react'
import { CardImg, CardWrap, CardContent, CardTitle, CardDetail, CardLikeButton } from '../styles/activityCard.styles';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import formatDateKorean from '../utils/formatDate';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import axios from 'axios';


const ActivityCard = (props) => {
  //좋아요 버튼을 눌렀는지 안눌렀는지 제어하는 상태변수
  //liked가 yes면 true, no면 false
  const [isLiked, setIsLiked] = useState(props.activity.liked === 'yes');
  //console.log(props.activity)
  const navigate = useNavigate();
  const {accessToken} = useContext(UserContext);

  const onLikeClick = async () => {
    //토큰이 없으면 로그인페이지로 이동시킴
    if(accessToken === null) {
      alert('로그인 후 이용해주세요');
      navigate('/login');
      return;
    }
    //하트가 안눌린 상태에서 하트를 누를 경우
    if(isLiked == false){
      //지금 로그인한 사람이 해당 게시물에 하트를 누른것
      try{
        await axios.post('/api/like',
          {id:props.activity.id},
          {headers: {Authorization: `Bearer ${accessToken}`}}
        );
        setIsLiked(true);//isLiked를 true변경하여 클릭한 하트로 변경
      }catch(err){
        console.log(err)
        alert('현재 서버에 문제가 있습니다 잠시 후 다시 시도하세요')
      }
    }else{ //하트가 눌린 상태에서 하트를 해제하는 구문
      //지금 로그인한 사람이 해당 게시물 하트를 해제한 것 => 데이터를 삭제
      try{
        await axios.delete('/api/like',{
          data : {id:props.activity.id},
          headers: {Authorization: `Bearer ${accessToken}`}
        })
        setIsLiked(false);
      }catch(err){
        console.log(err);
        alert('잠시 후 다시 실행하세요')
      }
    }
  }

  return (
    <CardWrap>
      <CardImg imgURL={props.activity.img_url[0]}>
        {/*클릭시 isLiked 상태 변수값을 변경 */}
        <CardLikeButton onClick={onLikeClick}>
          {/*isLiked가 true면 빨간색 하트 아이콘을 표시하고 false면 하얀색 선으로 된 하트 아이콘을 표시 */}
          {isLiked ? <FavoriteIcon style={{color: 'red'}} /> : <FavoriteBorderIcon style={{color: 'white'}} />}
        </CardLikeButton>
      </CardImg>
      <CardContent>
        <CardTitle>{props.activity.title}</CardTitle>
        <CardDetail>{props.activity.content}</CardDetail>
        <CardDetail>
          작성자: {props.activity.writer_email}
        </CardDetail>
        <CardDetail>
          작성일자: {formatDateKorean(props.activity.created_date)}
        </CardDetail>
        <CardDetail>
          좋아요: {props.activity.activity_like}
        </CardDetail>
        {/*버튼을 클릭하면 부모컴포넌트에서 전달받은 props의 id값을 엔드포인트로 해서 상세페이지로 이동 */}
        <button
          onClick={() => {
            navigate(`/activity/${props.activity.id}`)
          }}
        >자세히 보기</button>
      </CardContent>
    </CardWrap>
  )
}

export default ActivityCard