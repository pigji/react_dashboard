import styled from "@emotion/styled";

export const Header = styled.header`
  height:90px;
  position:sticky;
  top:0;

  display:flex;
  align-items:center;
  padding: 0 20px;
  background-color:rgba(255,255,255,0.8);
  /*backdrop-filter: blur(5px);*/
  justify-content: space-between;
`;

export const UserText = styled.p`
  font-size:1.7rem;
  font-weight:bold;
  color:#06b7db;
  & > span{
    color: #18181b;
    font-size:0.8rem;
  }
`;