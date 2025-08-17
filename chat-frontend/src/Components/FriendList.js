// import React, { useEffect, useState } from "react";
// import {
//     ViewFriendList,
//     removeFriend,
//     blockUser,
//     createOrGetChatRoom,
// } from "../api/api";

// const FriendList = ({ onChatStart, notifications = {} }) => {
//     const [friends, setFriends] = useState([]);

//     useEffect(() => {
//         const fetchData = async () => {
//             const response = await ViewFriendList();
//             console.log("FriendList response", response.data);

//             setFriends(response.data);

//             // Remove duplicates based on `id`
//             // const uniqueFriends = response.data.filter(
//             //     (friend, index, self) =>
//             //         index === self.findIndex((f) => f.id === friend.id)
//             // );

//             // console.log("unique friends", uniqueFriends);
//         };

//         fetchData();
//     }, []);

//     // handle clicking a friend to start chat
//     const handleChatClick = async (user2_id) => {
//         console.log("User clicked to chat:", user2_id);
//         const chatRoom = await createOrGetChatRoom(user2_id);
//         console.log("Friendlist : chat room", chatRoom);
//         if (chatRoom) {
//             onChatStart(chatRoom); // Open Chat room
//         }
//     };

//     // function for removed friend
//     const handleRemoveFriend = async (friendId) => {
//         await removeFriend(friendId);
//         setFriends(friends.filter((friend) => friend.id !== friendId));
//         alert("Friend removed!");
//     };

//     // function for block a user
//     const handleBlockUser = async (friendId) => {
//         const response = await blockUser(friendId);
//         if (response) {
//             setFriends(friends.filter((friend) => friend.id !== friendId));
//             alert("User blocked successfully");
//         } else {
//             alert("Friend to block user!");
//         }
//     };

//     return (
//         <div>
//             <ul>
//                 {friends.map((friend) => (
//                     <li key={friend.id} onClick={() => onChatStart(friend)} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//                         <span style={{ position: "relative" }}>
//                             {friend.username}{" "}
//                             {notifications[friend.id] && (
//                                 <span
//                                     style={{
//                                         position: "absolute",
//                                         top: -5,
//                                         right: -10,
//                                         width: "10px",
//                                         height: "10px",
//                                         backgroundColor: "red",
//                                         borderRadius: "50%",
//                                         display: "inline-block",
//                                     }}
//                                 />
//                             )}
//                         </span>
//                         <button onClick={() => handleRemoveFriend(friend.id)}>
//                             Remove
//                         </button>
//                         <button
//                             onClick={() => handleBlockUser(friend.id)}
//                             style={{ backgroundColor: "red", color: "white" }}
//                         >
//                             Block
//                         </button>
//                         <button onClick={() => handleChatClick(friend.id)}>Chat</button>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default FriendList;


import React, { useEffect, useState } from "react";
import {
    ViewFriendList,
    removeFriend,
    blockUser,
    createOrGetChatRoom,
} from "../api/api";
import {
    Box,
    Button,
    Stack,
    Typography,
    Paper,
    IconButton,
    Badge,
    Avatar
} from "@mui/material";
import ChatIcon from '@mui/icons-material/Chat';
import BlockIcon from '@mui/icons-material/Block';
import DeleteIcon from '@mui/icons-material/Delete';

const FriendList = ({ onChatStart, notifications = {} }) => {
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await ViewFriendList();
            setFriends(response.data);
        };
        fetchData();
    }, []);

    const handleChatClick = async (user2_id) => {
        const chatRoom = await createOrGetChatRoom(user2_id);
        if (chatRoom) {
            onChatStart(chatRoom);
        }
    };

    const handleRemoveFriend = async (friendId) => {
        await removeFriend(friendId);
        setFriends(friends.filter((friend) => friend.id !== friendId));
        alert("Friend removed!");
    };

    const handleBlockUser = async (friendId) => {
        const response = await blockUser(friendId);
        if (response) {
            setFriends(friends.filter((friend) => friend.id !== friendId));
            alert("User blocked successfully");
        } else {
            alert("Failed to block user");
        }
    };

    return (
        <Stack spacing={2}>
            {friends.map((friend) => (
                <Paper
                    key={friend.id}
                    elevation={3}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: 2,
                        borderRadius: 2,
                        backgroundColor: "#f9f9f9",
                        "&:hover": { backgroundColor: "#f1f1f1" },
                    }}
                >
                    <Avatar
                        src={friend.profile_image || ""}
                        alt={friend.username}
                        sx={{ width: 40, height: 40, mr: 2 }}
                    />
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Badge
                            variant="dot"
                            color="error"
                            invisible={!notifications[friend.id]}
                        >
                            <Typography variant="h6">{friend.username}</Typography>
                        </Badge>
                        <Typography variant="body2" color="text.secondary">
                            {friend.email}
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={1}>
                        <IconButton
                            color="primary"
                            onClick={() => handleChatClick(friend.id)}
                        >
                            <ChatIcon />
                        </IconButton>
                        <IconButton
                            color="error"
                            onClick={() => handleBlockUser(friend.id)}
                        >
                            <BlockIcon />
                        </IconButton>
                        <IconButton
                            color="secondary"
                            onClick={() => handleRemoveFriend(friend.id)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Stack>
                </Paper>
            ))}
        </Stack>
    );
};

export default FriendList;
