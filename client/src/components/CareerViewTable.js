import React, {useState, useEffect, useContext} from 'react'
import { AddBox } from '../styles/career.styles';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import axios from 'axios';
import { UserContext } from '../App';
import CareerRow from './CareerRow';

const CareerViewTable = () => {
  //데이터베이스에서 전달받은 데이터를 담을 상태 변수
  const [careerList, setCareerList] = useState([]);

  //state변수 4개, 사용자가 input태그에 입력한 값을 기억하는 용도
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  //전체 체크가 되었는지 아닌지 확인하기 위한 state변수
  const [isSelectAll, setIsSelectAll] = useState(false);

  //체크된 행의 id를 담을 배열, 처음에는 빈배열
  const [checkedRowId, setCheckedRowId] = useState([]);

  //전역 상태를 불러옴
  const {accessToken, setAccessToken} = useContext(UserContext);

  useEffect(() => {
    //CareerViewTable 컴포넌트가 화면에 보여질 때 실행되는 코드
    const fetchCareerList = async () => {
      if(accessToken === null) return;
      try{
        //get방식으로 api요청, 토큰을 보내줘야 한다
        let res = await axios.get('/api/career',{
          headers: {Authorization: `Bearer ${accessToken}`}
        });
        setCareerList(res.data);//응답받은 데이터를 careerList상태에 저장
        //console.log(careerList)
      }catch(err){
        console.log(err)
      }
    }
    fetchCareerList();//함수 호출
  }, [accessToken]);//컴포넌트가 처음 생성될때만 호출하기 위해 두번째 인자로 빈배열을 추가

  //입력한 값을 데이터베이스에 추가하는 함수
  const onAddCareer = async () => {
    //console.log(company, position, startDate, endDate);
    if(company === ''){//회사명을 입력하지 않았을 경우
      alert('회사명을 입력해주세요');
      return; //onAddCareer함수를 바로 종료
    }
    if(position === ''){
      alert('직책을 입력해주세요');
      return;
    }
    if(startDate === ''){
      alert('시작일을 입력해주세요');
      return;
    }

    //시작일이 오늘 날짜보다 늦으면 안됨
    const today = new Date();
    //startDate에 담겨있는 날짜 정보(string)를 date정보로 변경(시간을 0시0분0초로 설정)
    const targetStartDate = new Date(startDate+"T00:00:00")
    if(targetStartDate > today){//시작일이 현재 시간보다 나중일경우
      alert('시작일은 오늘 날짜보다 늦을 수 없습니다')
      return;
    }

    if(endDate !== ''){ //종료일이 비어 있지 않으면 실행
      const targetEndDate = new Date(endDate+"T00:00:00");
      if(targetEndDate < targetStartDate){//종료일이 시작일 보다 빠를 경우
        alert('종료일은 시작일보다 빠를 수 없습니다');
        return;
      }
      if(targetEndDate > today){//종료일이 현재시간보다 늦을 경우
        alert('종료일은 오늘 날짜보다 늦을 수 없습니다');
        return;
      }
      //정상적으로 실행되는 코드
    }

    try{
      //api로 post요청으로 해당 데이터를 전달 합니다.
      let res = await axios.post('/api/career', {
        company, position, startDate, endDate
      },{
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      //res.data에는 방금 추가한 '객체'가 들어있음
      alert('추가 완료!');
      //console.log(res.data);
      window.location.reload(); //새로고침
    }catch(err){
      console.log(err)
    }
  }
  //td셀을 클릭시 게시글을 삭제하는 함수
  const onDeleteCareer = async (id) => {
    //id를 가지고 express한테 삭제 요청
    //id에는 몇번 객체가 삭제되는지에 대한 정보가 들어있음
    try{
      //id를 {}로 감싸서 body에다가 담아줌
      let res = await axios.delete('/api/career', {
        data: {id}
      })
      alert('삭제 완료!')

      //삭제한 id를 제외한 나머지 요소들만 뽑아서 새로운 배열을 만들어서 careerList 상태변수에 넣어준다
      let newCareerList = careerList.filter((e) => e.id !== id);
      setCareerList(newCareerList)
      //careerList에서 삭제된 id를 가진 요소를 삭제하고 setCareerList설정함수로 변경
      //re-rendering 되면서 현재페이지에서 사라짐
    }catch(err){
      alert('삭제 실패!')
    }
  }

  //전체선택(표의 헤더부분에 있는 체크박스 클릭시 실행)
  const onSelectedAll = (e) => {
    console.log(e.target.checked)
    if(e.target.checked){//전체 선택이 되었을 경우
      setCheckedRowId(careerList.map((e) => e.id))//전체 게시글의 id값을 checkedRowId상태에 할당
      setIsSelectAll(true)
    }else{//체크가 해제되어 실행된다면
      setCheckedRowId([]);//배열을 비워서 모든 체크박스를 해제
      setIsSelectAll(false);//isSelectAll은 false로 변경
    }
     
  }

  //개별적으로 체크했을 때
  const onSelect = (e, id) => {
    console.log(e.target.checked)
    console.log(id)
    if(e.target.checked){//체크가 되었으면 배열에 id를 추가
      //배열에 id를 추가
      setCheckedRowId([...checkedRowId, id]);//기존에 배열에 추가한 id를 넣어줘
    }else{//체크가 해제되었으면 배열에서 id를 제거
      let newCheckedRowId = checkedRowId.filter((e) => e !== id);
      setCheckedRowId(newCheckedRowId);
    }
  }

  const deleteAll = async () => {
    //기본 careerList에서 삭제한 요소들을 제외한 배열 만들기
    let cpy = [...careerList];

    //체크된 행의 id를 가지고 express한테 삭제 요청
    try{
      //삭제가 체크된 체크박스 만큼 반복
      for(let i = 0; i < checkedRowId.length; i++){
        let id = checkedRowId[i];
        //{data: {id: checkedRowId}}
        await axios.delete('/api/career', {data: {id: id}})
        //체크가 안된 게시글만 cpy에 할당
        cpy = cpy.filter((row) => row.id !== id);
      }
      //반복이 다 끝나면 setCareerList(cpy)로 한번에 마지막 상태를 모두 삭제해준다
      setCareerList(cpy)
      alert('삭제 완료!');
    }catch(err){
      console.log(err);
      alert('삭제 하는 도중 문제가 발생하였습니다')
    }
  }

  return (
    <section>
      <AddBox style={{marginBottom: '50px'}}>
        <thead>
          <tr>
            <th rowSpan={2}>회사명(활동)</th>
            <th rowSpan={2}>직책(활동내용)</th>
            <th colSpan={2}>활동 일자</th>
          </tr>
          <tr>
            <th>시작일</th>
            <th>종료일</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            {/*값이 변경될때마다 상태변수를 입력한 값으로 할당 */}
            <td><input onChange={e => setCompany(e.target.value)} /></td>
            <td><input onChange={e => setPosition(e.target.value)} /></td>
            <td><input onChange={e => setStartDate(e.target.value)} type='date' /></td>
            <td><input onChange={e => setEndDate(e.target.value)} type='date' /></td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4}>
              {/*추가 버튼을 클릭하면 onAddCareer이 호출됨 */}
              <button onClick={onAddCareer}>추가</button>
            </td>
          </tr>
        </tfoot>
      </AddBox>
      <AddBox>
        <thead>
          <tr>
            <th><input
                onChange={onSelectedAll}
                checked={isSelectAll}
                type='checkbox' 
            /></th>
            <th>회사명</th>
            <th>직책</th>
            <th>일자</th>
            <th onClick={deleteAll}><DeleteSweepIcon/></th>
          </tr>
        </thead>
        <tbody>
          {careerList.map((e) => 
            <CareerRow 
              key={e.id}
              career={e}
              checkedRowId={checkedRowId}
              onDeleteRow={onDeleteCareer}
              onSelect={onSelect}
            />
          )}
        </tbody>
      </AddBox>
    </section>
  )
}

export default CareerViewTable