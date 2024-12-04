import { BgImg, AuthBody, AuthBox, AuthForm, AuthFooter, Button, CancelIcon, ErrMsg, Input, InputBoxWrap, Wrap, LogoImg, Line } from '../styles/auth.styles';
import CloseIcon from '@mui/icons-material/Close';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../App';

const Login = () => {
  //유효성 검사
  const [email, setEmail] = useState(''); //이메일(아이디)
  const [password, setPassword] = useState(''); //비밀번호

  //잘못된 이메일 입력시 출력할 에러 메시지
  const [emailErrMsg, setEmailErrMsg] = useState('');
  //잘못된 비밀번호 입력시 출력할 에러 메시지
  const [passwordErrMsg, setpasswordErrMsg] = useState('');
  const navigate = useNavigate();
  //App.js에 있는 accessToken변수와 setAccessToken함수를 사용하기
  const {setAccessToken} = useContext(UserContext);

  const onEmailChange = (e) => {
    //console.log(e.target.value)
    const emailText = e.target.value;
    setEmail(emailText);//이메일을 입력하면 setEmail을 통해 상태 변수에 저장

    if (emailText === "") {//입력창에 아무것도 입력하지 않았을 경우
      setEmailErrMsg("이메일은 필수 입력해 주세요")
    } else if (!emailText.includes("@")) {//입력한 글자에 @가 없으면 실행
      setEmailErrMsg("이메일 형식이 올바르지 않습니다")
    } else {//위 조건이 충족되면 에러메시지를 비워줍니다
      setEmailErrMsg("");
    }
  }

  const onPasswordChange = (e) => {
    const passwordText = e.target.value;
    setPassword(passwordText);

    if (passwordText === "") {
      setpasswordErrMsg("비밀번호는 필수 입력입니다")
    } else if (passwordText.length < 6) {//패스워드를 6글자 이하로 작성할 경우
      setpasswordErrMsg("비밀번호는 6자리 이상이어야 합니다")
    } else {
      setpasswordErrMsg('');
    }
  }

  //함수를 async 비동기 함수로 변경
  const onLoginSubmit = async (e) => {
    e.preventDefault();//기본 기능 제거
    let check = true;

    if (email === "") {//입력창에 아무것도 입력하지 않았을 경우
      setEmailErrMsg("이메일은 필수 입력해 주세요")
      check = false;
    } else if (!email.includes("@")) {//입력한 글자에 @가 없으면 실행
      setEmailErrMsg("이메일 형식이 올바르지 않습니다")
      check = false;
    } else {//위 조건이 충족되면 에러메시지를 비워줍니다
      setEmailErrMsg("");
    }

    if (password === "") {
      setpasswordErrMsg("비밀번호는 필수 입력입니다")
      check = false;
    } else if (password.length < 6) {//패스워드를 6글자 이하로 작성할 경우
      setpasswordErrMsg("비밀번호는 6자리 이상이어야 합니다")
      check = false;
    } else {
      setpasswordErrMsg('');
    }
    
    //여기까지 실행됬을때 check가 true면 아이디와 비밀번호 유효성검사를 모두 통과한것임
    if(check){
      //alert('로그인 유효성 검사가 끝나면 해야할 코드')
      //로그인한 회원 조회
      try{
        //axios라이브러리로 post요청을 보냅니다. 엔드포인트= /api/login
        //{email, password} = 요청 본문(body)으로 전송되는 데이터
        let res = await axios.post('/api/login', {email, password});
        alert(res.data.accessToken);//생성한 토큰을 경고창에 보여줍니다.
        //생성한 토큰을 로컬스토리지에 저장
        localStorage.setItem('accessToken', res.data.accessToken)
        //사용자를 처음페이지로 리디렉션합니다.

        //전역상태변수(App.js에 있는 accessToken)에 저장
        setAccessToken(res.data.accessToken)

        navigate('/', {replace:false})

      }catch(err){//로그인 실패시 
        console.log(err);
        if(err.response.status === 404){
          alert('아이디 또는 비밀번호를 확인해 주세요')
        }
      }
    }

  }

  return (
    <BgImg>
      <Wrap>
        <CancelIcon><CloseIcon/></CancelIcon>
        <AuthBox>
          <LogoImg src="/logo192.png" alt="logo"/>
          <AuthBody>
            <AuthForm onSubmit={onLoginSubmit}>
              <InputBoxWrap>
                <div className='input-box'>
                  <Input onChange={onEmailChange}
                    type='text' placeholder='아이디' />
                  <ErrMsg>{emailErrMsg}</ErrMsg>
                </div>
                <div className='input-box'>
                  <Input onChange={onPasswordChange} 
                    type='password' placeholder='비밀번호' />
                  <ErrMsg>{passwordErrMsg}</ErrMsg>
                </div>
              </InputBoxWrap>
              <Button>로그인 하기</Button>
            </AuthForm>
            <Line className='line'></Line>
            <AuthFooter>
              <Link to="">이메일 찾기</Link>
              <Line className='line'></Line>
              <Link to="">비밀번호 찾기</Link>
              <Line className='line'></Line>
              <Link to="/join">회원가입 하기</Link>
            </AuthFooter>
          </AuthBody>
        </AuthBox>
      </Wrap>
    </BgImg>
  )
}

export default Login;