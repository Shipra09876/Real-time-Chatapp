// import React, { useState, useEffect } from "react";
// import FriendList from "../Components/FriendList";
// import ChatArea from "../Components/ChatArea";
// import { Link } from 'react-router-dom';
// import { toast, ToastContainer } from 'react-toastify';
// import { Box, Typography, Divider, Button, Stack, Paper } from "@mui/material";
// import 'react-toastify/dist/ReactToastify.css';

// const Inbox = () => {
//     const [selectedChatRoom, setselectedChatRoom] = useState(null);
//     const [notifications, setNotifications] = useState({});

//     const user = JSON.parse(sessionStorage.getItem('user'));
//     const token = sessionStorage.getItem("accessToken");

//     useEffect(() => {
//         const notificationSocket = new WebSocket(`ws://127.0.0.1:8000/ws/notifications/?token=${token}`);

//         notificationSocket.onmessage = (event) => {
//             const data = JSON.parse(event.data);

//             if (data.type === "connection_success") return;

//             if (data.type === "send_notification") {
//                 const senderId = data.sender;
//                 const message = data.content;

//                 if (!senderId || !message) return;

//                 toast.info(
//                     <>
//                         <strong>{senderId}</strong><br />
//                         {message}
//                     </>,
//                     {
//                         position: "top-right",
//                         autoClose: 4000,
//                         pauseOnHover: true,
//                     }
//                 );
//             }
//         };

//         return () => {
//             notificationSocket.close();
//         };
//     }, [selectedChatRoom]);

//     const handleChatStart = (friend) => {
//         setselectedChatRoom(friend);
//         setNotifications(prev => ({
//             ...prev,
//             [friend.id]: false,
//         }));
//     };

//     return (
//         <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#f5f5f5' }}>
//             {/* Sidebar */}
//             <Box
//                 sx={{
//                     width: '25%',
//                     backgroundColor: '#e3f2fd',
//                     padding: 2,
//                     display: 'flex',
//                     flexDirection: 'column',
//                     borderRight: '1px solid #ccc',
//                 }}
//             >
//                 <Stack spacing={2} sx={{ mb: 3 }}>
//                     <Button variant="contained" component={Link} to="/find-friend">
//                         Find Friend
//                     </Button>
//                 </Stack>

//                 <Divider sx={{ my: 2 }} />

//                 <FriendList onChatStart={handleChatStart} notifications={notifications} />
//             </Box>

//             {/* Chat Area */}
//             <Box sx={{ flex: 1, p: 2 }}>
//                 <Paper sx={{ height: '100%', p: 2 }}>
//                     {selectedChatRoom ? (
//                         <ChatArea friend={selectedChatRoom} />
//                     ) : (
//                         <Typography variant="body1" color="textSecondary">
//                             Select a friend to start chatting.
//                         </Typography>
//                     )}
//                 </Paper>
//             </Box>

//             {/* Toast */}
//             <ToastContainer position="top-right" autoClose={3000} />
//         </Box>
//     );
// };

// export default Inbox;


import React, { useState, useEffect } from "react";
import FriendList from "../Components/FriendList";
import ChatArea from "../Components/ChatArea";
import FindFriend from "./FindFriend";
import {
  Box,
  Typography,
  Divider,
  IconButton,
  InputBase,
  Stack,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Inbox = () => {
  const [selectedChatRoom, setselectedChatRoom] = useState(null);
  const [notifications, setNotifications] = useState({});
  const [showFindFriend, setShowFindFriend] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const token = sessionStorage.getItem("accessToken");

  useEffect(() => {
    const notificationSocket = new WebSocket(
      `ws://127.0.0.1:8000/ws/notifications/?token=${token}`
    );

    notificationSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "connection_success") return;
      if (data.type === "send_notification") {
        toast.info(
          <>
            <strong>{data.sender}</strong><br />
            {data.content}
          </>
        );
      }
    };

    return () => {
      notificationSocket.close();
    };
  }, [selectedChatRoom]);

  const handleChatStart = (friend) => {
    setselectedChatRoom(friend);
    setNotifications((prev) => ({ ...prev, [friend.id]: false }));
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f5f5f5" }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: "35%",
          backgroundColor: "#e3f2fd",
          padding: 2,
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid #ccc",
        }}
      >
        {/* Search Bar Toggle */}
        <Paper
          component="form"
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            padding: "2px 4px",
            marginBottom: 2,
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Find friend..."
            inputProps={{ "aria-label": "find friend" }}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <IconButton
            type="button"
            sx={{ p: "10px" }}
            onClick={() => setShowFindFriend(!showFindFriend)}
          >
            <SearchIcon />
          </IconButton>
        </Paper>

        <Divider sx={{ my: 2 }} />

        {showFindFriend ? (
          <FindFriend searchValue={searchInput} />
        ) : (
          <FriendList onChatStart={handleChatStart} notifications={notifications} />
        )}
      </Box>

      {/* Chat Area */}
      <Box sx={{ flex: 1, p: 2 }}>
        <Paper sx={{ height: "100%", p: 2 }}>
          {selectedChatRoom ? (
            <ChatArea friend={selectedChatRoom} />
          ) : (
            <Typography variant="body1" color="textSecondary">
              Select a friend to start chatting.
            </Typography>
          )}
        </Paper>
      </Box>

      <ToastContainer position="top-right" autoClose={3000} />
    </Box>
  );
};

export default Inbox;
