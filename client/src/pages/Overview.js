import React,{useEffect, useState, useContext} from 'react'
import LayoutPage from '../components/LayoutPage';
import { UserContext } from '../App';
import { useAuth } from '../hooks/hooks';
import axios from 'axios';
import { Container, Info, Label, ProfileCard } from '../styles/overview.styles';

const Overview = () => {
  useAuth();
  const {accessToken} = useContext(UserContext);
  const [loggedInUser, setLoggedInUser] = useState({
    email: '',
    created_date: '',
    updated_date: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      try{
        let res = await axios.get('/api/loggedInEmail', {
          headers: {Authorization: `Bearer ${accessToken}`}
        });

        let res2 = await axios.get(`/api/users/${res.data}`)
        console.log(res2.data)
        setLoggedInUser(res2.data)
      }catch(err){
        console.log(err)
      }
    }

    fetchUser()
  },[accessToken])

  return (
    <LayoutPage target="Overview">
      <Container>
        <ProfileCard>
          <Info>
            <div><Label>Email:</Label>{loggedInUser.email}</div>
            <div>
              <Label>Created date:</Label>{loggedInUser.created_date}
            </div>
            <div>
              <Label>Updated date:</Label>{loggedInUser.updated_date}
            </div>
          </Info>
        </ProfileCard>
      </Container>
    </LayoutPage>
  )
}

export default Overview