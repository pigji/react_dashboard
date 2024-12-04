import React from 'react'
import { Aside, AsideLogo, AsideMenuItem, LogoText, Menu } from '../styles/sidebar.styles';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import AssingmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import TopicOutlinedIcon from '@mui/icons-material/TopicOutlined';
import ChecklistOutlinedIcon from '@mui/icons-material/ChecklistOutlined';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';

const SidebarPage = () => {
  return (
    <Aside>
      <AsideLogo>
        <img src={'/logo192.png'} alt='logo'/>
        <LogoText>Portfolio For</LogoText>
      </AsideLogo>
      <nav>
        <Menu>
          <li>
            <AsideMenuItem>
              <DashboardOutlinedIcon />
              <p>Overview</p>
              <KeyboardArrowRightOutlinedIcon/>
            </AsideMenuItem>
          </li>
          <li>
            <AsideMenuItem active={true}>
              <AssingmentIndOutlinedIcon />
              <p>경력</p>
              <KeyboardArrowRightOutlinedIcon/>
            </AsideMenuItem>
          </li>
          <li>
            <AsideMenuItem>
              <TopicOutlinedIcon />
              <p>활동 게시판</p>
              <KeyboardArrowRightOutlinedIcon/>
            </AsideMenuItem>
          </li>
        </Menu>
      </nav>
    </Aside>
  )
}

export default SidebarPage