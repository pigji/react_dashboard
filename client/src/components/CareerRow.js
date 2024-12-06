import React,{useState, useRef, useContext} from 'react'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import formatDateKorean from '../utils/formatDate';
import axios from 'axios';
import { UserContext } from '../App';


//부모컴포넌트에서 전달받은 속성들을 props로 받음
const CareerRow = (props) => {
  //만일 isEdit에 true가 들어있으면 해당 행이 편집모드임을 의미 false면 편집 모드가 아님을 의미
  const [isEdit, setIsEdit] = useState(false);
  //useRef훅을 사용하여 company, position, start_date, end_date 입력 필드에 대한 참조를 각각 생성합니다.
  const companyInputRef = useRef();
  const positionInputRef = useRef();
  const startDateInputRef = useRef();
  const endDateInputRef = useRef();
  //useRef를 사용하는 이유 = useState는 상태가 변경되면 컴포넌트가 리렌더링되지만 useRef는 리렌더링 없이 상태값을 변경할 수 있기 때문입니다.

  //props.career = e;
  const e = props.career;
  //부모컴포넌트에서 전달받은 props에서 객체 분해 할당으로 속성값을 분해합니다.
  const {checkedRowId, onSelect, onDeleteRow} = props;

  //전역변수에 저장된 accessToken을 가져온다
  const {accessToken} = useContext(UserContext);

  //상태를 수정상태로 변경해주는 함수
  const onEditState = () => {
    setIsEdit(true); //isEdit상태를 true로 변경
  }

  //수정하기 버튼 클릭시 실행될 함수
  const onEditClick = async (id) => {//id에는 수정할 행의 id가 들어있음
    //사용자 입력한 company, position, startDate, endDate가져오기
    const company = companyInputRef.current.value;
    const position = positionInputRef.current.value;
    const startDate = startDateInputRef.current.value;
    const endDate = endDateInputRef.current.value;

    //console.log(company, position, startDate, endDate)
    //유효성 검사
    if(company === ''){
      alert('회사명은 필수 입력입니다')
      return;
    }
    if(position === ''){
      alert('직책은 필수 입력입니다')
      return;
    }
    if(startDate === ''){
      alert('시작일은 필수 입력입니다')
      return;
    }
    const today = new Date();
    const startDateTmp = new Date(startDate+"T00:00:00");

    if(startDateTmp > today){
      alert('시작일은 오늘 날짜를 넘어가면 안됩니다.');
      return;
    }

    if(endDate !== ''){
      const endDateTmp = new Date(endDate+"T00:00:00");
      if(endDateTmp < startDateTmp){
        alert('종료일은 시작일보다 이전으로 설정할 수 없습니다')
        return;
      }
      if(endDateTmp > today){
        alert('종료일은 오늘 날짜를 넘어가면 안됩니다');
        return;
      }
    }
    //유요한 값들이 입력되었음을 확인했다면
    //express 서버에 입력한 값들을 전달하여 수정 요청
    try{
      await axios.put(
        '/api/careers', 
        {company, position, startDate, endDate, id},
        {headers: {Authorization: `Bearer ${accessToken}`}}
      );//로그인 했을때만 사용할 수 있으니까, headers에 토큰 전달
      alert('수정완료~!');
      setIsEdit(false);//수정이 완료된 후 -> 수정상태를 false로 바꾸기
      //e안에 있는 company, position, startDate, endDate변경
      e.company = company;
      e.position = position;
      e.start_date = startDate;
      e.end_date = endDate;
    }catch(err){
      console.log(err)
      alert("오류발생!")
    }
  }

  return (
    <tr key={e.id}>
      <td><input
        type="checkbox"
        checked={checkedRowId.includes(e.id)}
        onChange={(event) => onSelect(event, e.id)}
      /></td>
      <td onClick={onEditState}>{isEdit ? <input ref={companyInputRef} defaultValue={e.company}/> : e.company}</td>
      <td onClick={onEditState}>{isEdit ? <input ref={positionInputRef} defaultValue={e.position}/> : e.position}</td>
      <td onClick={onEditState} style={{display:"flex"}}>
        {isEdit ? (<input ref={startDateInputRef} defaultValue={e.start_date} type='date'/>) : formatDateKorean(e.start_date)} 
        - 
        {isEdit ? (<input ref={endDateInputRef} defaultValue={e.end_date} type='date'/>) : formatDateKorean(e.end_date)}
      </td>
      {/*버튼 클릭시 편집 모드일때는 게시글을 수정하고 편집 모드가 아닐때는 삭제 */}
      <td
        onClick={() => {
          if(isEdit){ //isEdit가 true면 수정모드
            onEditClick(e.id)
          }else{//isEdit가 false면 삭제모드
            onDeleteRow(e.id)
          }
        }}
        style={{
          cursor:"pointer",
          textAlign:'center'
        }}>
        {isEdit ? <EditIcon/> : <DeleteOutlineIcon />}
      </td>
    </tr>
  )
}

export default CareerRow