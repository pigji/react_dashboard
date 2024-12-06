//날짜를 한국식 포맷으로 변환하는 함수
const formatDateKorean = (dateStr) => {
  //dateStr은 외부에서 인자로 전달받은 날짜
  if(dateStr){//날짜 데이터가 있으면
    //전달받은 날짜 데이터로 날짜 정보 객체를 생성
    const date = new Date(dateStr)
    //날짜 포맷을 한국식으로 변경하여 반환
    return date.toLocaleDateString('ko', {
      day: "numeric",
      month: "long",
      year : "numeric"
    })
  }else{//날짜 데이터가 없으면 빈데이터를 리턴
    return dateStr;
  }
}

export default formatDateKorean;