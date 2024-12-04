import styled from "@emotion/styled";

export const Aside = styled.aside`
  width:240px;
  position:fixed;
  top:0; 
  left:0; 
  bottom:0;
  overflow-y: scroll;
  display:flex;
  flex-direction: column;
  row-gap:20px;
  padding: 0 20px;
  background-color:rgba(255,255,255,0.8);
  &::-webkit-scrollbar{
    display:none;
  }
`;

export const AsideLogo = styled.div`
  height:90px;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:20px 0;
  column-gap:10px;
  & > img{
    height:100%;
  }
`;

export const AsideMenuItem = styled.div`
  cursor:pointer;
  transition: 0.5s;
  display:flex;
  align-items:center;
  border-radius:10px;
  padding:10px 20px;
  column-gap:10px;
  font-size:1rem;
  color:#18181b;
  position:relative;
  &:hover{
    background-color:#a2e9c1;
  }
  & > p{
    flex-grow: 1;
  }
  & > .sub-icon{
    position:absolute;
    left: -13px;
    top: 7px;
  }

  & > svg{
    font-size:16px;
  }
  
  ${(props) => props.active && {backgroundColor: '#a2e9c1'}}

`;

export const Menu = styled.ul`
  display:flex;
  flex-direction: column;
  row-gap: 10px;
`;

export const LogoText = styled.p`
  font-size:1.7rem;
  font-weight:bold;
  color: #06b7db;
`;