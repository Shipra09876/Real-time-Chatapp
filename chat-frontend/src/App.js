import { Routes, Route } from 'react-router-dom';
import './App.css';
import Signup from './Components/Signup';
import Login from './Components/Login';
import Profile from './Components/Profile';
import NavBar from './Components/navBar';
import ChatArea from './Components/ChatArea';
import SideBar from './Components/SideBar';
import UserLogout from './Components/logout';
import Send_Reset_Email_Link from './Components/ForgotPassword/send-reset-email-link';
import Reset_Password from './Components/ForgotPassword/reset-password';
import FindFriend from './Components/FindFriend';
import FriendList from './Components/FriendList';
import FriendRequests from './Components/FriendRequests';
import Inbox from './Components/Inbox';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import BlockList from './Components/BlockList';


function App() {
  const accessToken = sessionStorage.getItem('accessToken');
  const refreshToken = sessionStorage.getItem('refreshToken');

  return (
    <div>
      <div>
        <NavBar />
      </div>
      <div className='chat-container'>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path='/logout' element={<UserLogout onlogout={handleUserLoggedOut} />} /> */}
          <Route path="/profile" element={<Profile accessToken={accessToken} refreshToken={refreshToken} />} />
          <Route path="/forgot-password" element={<Send_Reset_Email_Link />} />
          <Route path="/reset_password/:uid/:token" element={<Reset_Password />} />
          <Route path="/chat" element={<Inbox />} />
          <Route path="/find-friend" element={<FindFriend />} />
          <Route path="/friends" element={<FriendList />} />
          <Route path="/friends-requests" element={<FriendRequests />} />
          <Route path="/blocked-list" element={<BlockList />} />
        </Routes>
      </div>
      <ToastContainer position="top-right" autoClose={4000} />
    </div>
  );
};


export default App;
