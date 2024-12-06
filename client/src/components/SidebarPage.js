import React from 'react'
import { Aside, AsideLogo, AsideMenuItem, LogoText, Menu } from '../styles/sidebar.styles';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import AssingmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import TopicOutlinedIcon from '@mui/icons-material/TopicOutlined';
import ChecklistOutlinedIcon from '@mui/icons-material/ChecklistOutlined';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import { useNavigate } from 'react-router-dom';

const SidebarPage = (props) => {
  const navigate = useNavigate();

  //path를 배열로 설정
  let items = [
    { icon: <DashboardOutlinedIcon />, title: 'Overview', path: '/' },
    { icon: <AssingmentIndOutlinedIcon />, title: '경력', path: '/career' },
    { icon: <TopicOutlinedIcon />, title: '활동게시판', path: '/activity' }
  ];

  return (
    <Aside isOpen={props.isOpen}>
      <AsideLogo>
        <img src={'/logo192.png'} alt='logo' />
        <LogoText>Portfolio For</LogoText>
      </AsideLogo>
      <nav>
        <Menu>
          {/*items를 순회하여 메뉴 리스트를 추가 */}
          {items.map((el) => 
            //li를 클릭하면 el의 path경로로 이동
            <li key={el.title} onClick={() => navigate(el.path)}>
              {/*items객체의 title속성값과 부모 컴포넌트로 전달받은 target속성값이 같으면 active클래스를 추가하여 하이라이트 */}
              <AsideMenuItem active={el.title === props.target}>
                {el.icon}
                <p>{el.title}</p>
                <KeyboardArrowRightOutlinedIcon />
              </AsideMenuItem>
            </li>
          )}
        </Menu>
      </nav>
    </Aside>
  )
}

export default SidebarPage