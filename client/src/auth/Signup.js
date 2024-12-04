import React, { useState } from 'react'
import { ModalWrap, Modal, BgImg, AuthBody, AuthBox, AuthForm, Button, CancelIcon, ErrMsg, Input, InputBoxWrap, Option, Select, Wrap } from '../styles/auth.styles';
import CloseIcon from '@mui/icons-material/Close';
//비동기 통신을 위한 라이브러리
import axios from 'axios';
//useNavigate 훅은 회원가입 후 로그인 페이지로 바로 이동하기위해 사용
import { useNavigate } from 'react-router-dom';


const Signup = () => {
  //유효성 검사의 논리
  //1. input태그의 값이 변화할때마다 state변수에 저장해준다.
  //2. 버튼을 클릭 했을때 state변수에 저장된 값이 유효한 값인지 검사한다.
  //3. 유효한 값이 아니라면 에러 메시지 state변수를 변화해준다
  //4. state변수가 바뀌었으니까, 리렌더링이 된다(에러 메시지가 보인다)
  const [email, setEmail] = useState(''); //이메일(아이디)
  const [password, setPassword] = useState(''); //비밀번호
  const [passwordCheck, setPasswordCheck] = useState(''); //비밀번호 확인
  const [question, setQuestion] = useState(1); //비밀번호 찾기 질문
  const [answer, setAnswer] = useState(''); //비밀번호 찾기 질문에 대한 답

  //잘못된 이메일 입력시 출력할 에러 메시지
  const [emailErrMsg, setEmailErrMsg] = useState('');
  //잘못된 비밀번호 입력시 출력할 에러 메시지
  const [passwordErrMsg, setpasswordErrMsg] = useState('');
  //잘못된 비밀번호 확인 입력시 출력할 에러 메시지
  const [passwordCheckErrMsg, setpasswordCheckErrMsg] = useState('');
  //비밀번호 찾기 답을 입력하지 않았을 경우 출력할 에러 메시지
  const [answerErrMsg, setAnswerErrMsg] = useState('');
  //모달창이 열려있는지 닫혀있는지 판단하는 state
  const [isOpen, setIsOpen] = useState(false);
  //useNavigate훅을 등록
  const navigate = useNavigate();


  const emailInputHandler = (e) => {
    //console.log(e.target.value)
    setEmail(e.target.value);//이메일을 입력하면 setEmail을 통해 상태 변수에 저장
    const emailText = e.target.value;

    if (emailText === "") {//입력창에 아무것도 입력하지 않았을 경우
      setEmailErrMsg("이메일은 필수 입력해 주세요")
    } else if (!emailText.includes("@")) {//입력한 글자에 @가 없으면 실행
      setEmailErrMsg("이메일 형식이 올바르지 않습니다")
    } else {//위 조건이 충족되면 에러메시지를 비워줍니다
      setEmailErrMsg("");
    }
  }

  const passwordInputHandler = (e) => {
    const passwordText = e.target.value;
    setPassword(passwordText);

    if (passwordText === "") {
      setpasswordErrMsg("비밀번호는 필수 입력입니다")
    } else if (passwordText.length < 6) {//패스워드를 6글자 이하로 작성할 경우
      setpasswordErrMsg("비밀번호는 6자리 이상이어야 합니다")
    } else {
      setpasswordErrMsg('');
    }
    //입력한 비밀번호와 입력한 비밀번호 확인 부분이 일치하지 않으면 비밀번호 확인에 에러메시지를 출력
    if (passwordText !== passwordCheck) {
      setpasswordCheckErrMsg("비밀번호가 일치하지 않습니다")
    }
  }

  const passwordCheckInputHandler = (e) => {
    const passwordCheckText = e.target.value;
    setPasswordCheck(passwordCheckText);

    if (passwordCheckText === "") {
      setpasswordCheckErrMsg('비밀번호 확인은 필수 입력입니다');
    } else if (passwordCheckText !== password) {//비밀번호와 일치하지 않으면
      setpasswordCheckErrMsg('비밀번호가 일치하지 않습니다');
    } else {
      setpasswordCheckErrMsg('');
    }
  }
  const onSelectHandler = (e) => { //question에 선택한 질문의 번호를 저장
    setQuestion(parseInt(e.target.value))
    //console.log(question)
  }
  const onAnswerInputHandler = (e) => {
    setAnswer(e.target.value);
    if (e.target.value === '') {
      setAnswerErrMsg('이메일 찾기 응답은 필수 입력 값입니다')
    } else {
      setAnswerErrMsg("");
    }
  }

  const submitHandler = (e) => {
    //submit event가 발생하면 실행되는 함수
    //e에는 발생한 이벤트 객체가 대입된다.
    //이벤트의 기본 동작을 막아줍니다.(데이터 전송을 막아줌)
    e.preventDefault();

    let check = true; //정상적으로 입력하면 값이 true
    //이메일 input 태그 확인 email state확인
    if (email === '') {
      setEmailErrMsg('이메일은 필수 입력 값입니다');
      check = false; //정상적으로 입력안되고 값이 없으면 false로 변경
    } else if (!email.includes("@")) {//입력한 글자에 @가 없으면 실행
      setEmailErrMsg("이메일 형식이 올바르지 않습니다");
      check = false;
    } else {//위 조건이 충족되면 에러메시지를 비워줍니다
      setEmailErrMsg("");
    }

    //비밀번호 입력 확인
    if (password === "") {
      setpasswordErrMsg("비밀번호는 필수 입력입니다");
      check = false;
    } else if (password.length < 6) {//패스워드를 6글자 이하로 작성할 경우
      setpasswordErrMsg("비밀번호는 6자리 이상이어야 합니다")
      check = false;
    } else {
      setpasswordErrMsg('');
    }

    //비밀번호 확인 입력 확인
    if (passwordCheck === "") {
      setpasswordCheckErrMsg('비밀번호 확인은 필수 입력입니다');
      check = false;
    } else if (passwordCheck !== password) {//비밀번호와 일치하지 않으면
      setpasswordCheckErrMsg('비밀번호가 일치하지 않습니다');
      check = false;
    } else {
      setpasswordCheckErrMsg('');
    }

    //대답 입력 확인
    if (answer === '') {
      setAnswerErrMsg('이메일 찾기 응답은 필수 입력 값입니다')
      check = false;
    } else {
      setAnswerErrMsg("");
    }
    //모든 입력 값들이 정상적으로 입력되었다면 check = true
    if (check) {
      console.log(e.target)
      //서버로 전송
      axios.post('/api/users', {
        email,
        password,
        question,
        answer
      }).then((res) => {
        console.log(res)
        //회원가입 성공 했다면 실행시킬 코드
        //alert('회원가입이 완료되었습니다')
        //submit 했을때 isOpen을 true로 바꿔서 성공시 모달창 보이게 설정 
        setIsOpen(true);
      }).catch((err) => {
        console.log(err)
        //회원가입 실패 했다면 실행시킬 코드
        if (err.response.data.errCode === 1) {
          setEmailErrMsg('아이디가 너무 길어요');
        } else if (err.response.data.errCode === 2) {
          setEmailErrMsg('이미 중복된 아이디가 존재합니다')
        } else {
          setEmailErrMsg('서버쪽에서 에러가 발생했습니다')
        }
      })
    }
  }
  //모달창 확인 버튼이 클릭됬었을때 실행
  const onModalClick = () => {
    //navigate를 이용해서 로그인 페이지로 이동
    navigate("/login", {replace: true}); //replace를 true로 설정하면 페이지를 뒤로 이동 못함
  }
  return (
    <>
      {/*isOpen상태값을 props로 스타일 컴포넌트로 전달 */}
      <ModalWrap isOpen={isOpen}>
        <Modal>
          <h1>회원가입이 완료되었습니다</h1>
          <p>확인을 누르시면 로그인 페이지로 이동합니다</p>
          <button onClick={onModalClick}>확인</button>
        </Modal>
      </ModalWrap>
      <BgImg>
        <Wrap>
          <CancelIcon><CloseIcon /></CancelIcon>
          <AuthBox>
            <h1>회원가입</h1>
            <AuthBody>
              <AuthForm onSubmit={submitHandler}>
                <InputBoxWrap>
                  <div className='input-box'>
                    <Input name='email' onChange={emailInputHandler}
                      type='text' placeholder="아이디" />
                    <ErrMsg>{emailErrMsg}</ErrMsg>
                  </div>
                  <div className='input-box'>
                    <Input name='pw' onChange={passwordInputHandler}
                      type='password' placeholder="비밀번호" />
                    <ErrMsg>{passwordErrMsg}</ErrMsg>
                  </div>
                  <div className='input-box'>
                    <Input onChange={passwordCheckInputHandler}
                      type='password' placeholder="비밀번호 확인" />
                    <ErrMsg>{passwordCheckErrMsg}</ErrMsg>
                  </div>
                  <div className='input-box'>
                    <Select name='question' onChange={onSelectHandler}>
                      <Option value={1}>내가 태어난 곳은?</Option>
                      <Option value={2}>어린시절 나의 별명은?</Option>
                      <Option value={3}>나의 강아지 이름은?</Option>
                    </Select>
                    <Input name='answer' onChange={onAnswerInputHandler}
                      type='text' placeholder="이메일을 찾을 때의 질문에 답하세요" />
                    <ErrMsg>{answerErrMsg}</ErrMsg>
                  </div>
                </InputBoxWrap>
                <Button>회원가입하기</Button>
              </AuthForm>
            </AuthBody>
          </AuthBox>
        </Wrap>
      </BgImg>
    </>
  )
}

export default Signup