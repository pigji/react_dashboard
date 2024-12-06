import styled from '@emotion/styled';

export const CardWrap = styled.div`
  box-shadow: 3px 4px 12px rgba(0,0,0,0.08);
  border-radius: 6px;
  overflow: hidden;
  width:350px;
`;

//props로 전달받은 imgURL값이 undefined이면 default이미지로 배경이미지를 적용하고 null이 아니면 imgURL값을 배경이미지로 적용
export const CardImg = styled.div`
  background-image: url(${(props) => props.imgURL === undefined ? 'images/activity-default.jpg' : props.imgURL});
  height:250px;
  background-size:cover;
  background-position:center;
  position:relative;
`;

export const CardContent = styled.div`
  padding:15px 20px;
`;

export const CardTitle = styled.h2`
  font-size: 18px;
  color: black;
  margin: 5px 0;
`;

export const CardDetail = styled.p`
  font-size: 16px;
  color: silver;
  margin: 5px 0;
`;

export const CardLikeButton = styled.div`
  position:absolute;
  top:20px;
  left:20px;
  cursor:pointer;
`;