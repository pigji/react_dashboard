import {createContext, useState} from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Signup from './auth/Signup';
//import ExpressTest from './ExpressTest';
import Login from './auth/Login';
import Career from './pages/Career';

//(컴포넌트 전역에서 사용할 상태값을 생성)다른데서도 써야하니까 export 써주는거 잊지 말자
export const UserContext = createContext();

function App() {
  //전역에서 사용할 상태 변수
  const [accessToken, setAccessToken] = useState(null);
  //로그인을 안한 상태는 null설정
  return (
    <UserContext.Provider value={{accessToken, setAccessToken}}>
      <Router>
        <Routes>
          <Route path="/" element={<Career />}/>
          {/*/login패스경로로 Login컴포넌트를 설정 */}
          <Route path="/login" element={<Login />}/>
          {/*Signup컴포넌트 설정 */}
          <Route path="/join" element={<Signup />}/>
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
