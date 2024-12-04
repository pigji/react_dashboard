import styled from "@emotion/styled";

//만든것은 모두 다른 파일에서도 사용할 수 있도록 export해준다.
export const BgImg = styled.div`
  width:100%;
  background-image:url('auth-bg.jpg');
  background-repeat: no-repeat;
  background-size:cover;
  background-position:center;
`
export const Wrap = styled.div`
  min-height:100vh;
  background-color:rgba(255,255,255,0.8);
  display:flex;
  justify-content:center;
  align-items:center;
  box-sizing:border-box;
  padding-top:100px;
  padding-bottom:150px;
  position:relative;
`;

export const AuthBox = styled.div`
  width:400px;
  display:flex;
  flex-direction: column;
  row-gap:30px;
  & > h1{
    text-align:center;
  }
`;

export const AuthForm = styled.form`
  display:flex;
  flex-direction:column;
  row-gap:60px;
`;

export const Input = styled.input`
  background:none;
  padding:10px 5px;
  border-radius:10px;
  border:1px solid #263238;
  outline:none;
  width:100%;
  box-sizing:border-box;
`;

export const Button = styled.button`
  padding:10px 5px;
  border-radius:10px;
  cursor:pointer;
  border:none;
  background-color:#81c784;
`;

export const ErrMsg = styled.p`
  color:red;
  font-size:15px;
  padding-left:10px;
`;

export const InputBoxWrap = styled.div`
  display:flex;
  flex-direction: column;
  row-gap: 20px;
`;

export const LogoImg = styled.img`
  width:100px;
  align-self:center;
`;

export const AuthBody = styled.div`
  display:flex;
  flex-direction: column;
  row-gap:20px;
`;

export const Line = styled.div`
  border-top:1px solid black;
  border-bottom:1px solid black;
`;

export const AuthFooter = styled.div`
  display:flex;
  justify-content:center;
  column-gap: 15px;
  align-items:center;
  & > .line{
    height:10px;
  }
`;

export const CancelIcon = styled.div`
  position:absolute;
  right:30px;
  top:30px;
  cursor:pointer;
`;

export const Select = styled.select`
  width:100%;
  padding:10px 15px;
  background:none;
  & + input{
    margin-top:5px;
    border-radius:1px;
  }
`;

export const Option = styled.option`
  background:rgba(255,255,255,0.8);
  padding:10px;
`;

//singup컴포넌트에서 전달받은 props의 isOpen상태값이 true면 display값을 flex,flase면 none으로 설정
export const ModalWrap = styled.div`
  position:fixed;
  top:0; 
  left:0; 
  bottom:0; 
  right:0;
  z-index:999;

  background-color:rgba(0,0,0,0.8);
  display:${(props) => {return props.isOpen ? 'flex' : 'none'}};
  justify-content: center;
  align-items: center;
`;

export const Modal = styled.div`
  width:450px;
  background-color:white;
  border-radius: 16px;
  display:flex;
  flex-direction: column;
  align-items:center;
  padding:30px;
  & > h1{
    font-size:24px;
  }
  & > p{
    margin:10px 0;
  }
`;