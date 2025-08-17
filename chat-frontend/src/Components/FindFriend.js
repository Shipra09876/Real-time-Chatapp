import React, { useState, useEffect } from "react";
import { findFriend, sendFriendRequest } from "../api/api";
import {
  TextField,
  Button,
  Stack,
  Avatar,
  Typography,
  Paper,
  Alert,
} from "@mui/material";

const FindFriend = ({ searchValue }) => {
  const [query, setQuery] = useState(searchValue || "");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const searchField = async () => {
    try {
      const response = await findFriend(query);
      setResults(response.data);
      setError("");
    } catch (err) {
      setError("Error finding friends. Please try again.");
    }
  };

  useEffect(() => {
    if (searchValue) {
      setQuery(searchValue);
      searchField();
    }
  }, [searchValue]);

  const handleSendRequest = async (receiver_id) => {
    try {
      await sendFriendRequest(receiver_id);
      alert("Friend request sent successfully!");
    } catch (err) {
      alert("Failed to send friend request.");
    }
  };

  return (
    <Stack spacing={2}>
      {error && <Alert severity="error">{error}</Alert>}

      {results.map((user) => (
        <Paper
          key={user.id}
          elevation={2}
          sx={{ display: "flex", alignItems: "center" , p:2, mr:2}}
        >
          <Avatar
            src={user.profile_image || ""}
            alt={user.username}
            sx={{ width: 40, height: 40, mr: 2 }}
          />
          <Stack sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">{user.username}</Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Stack>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleSendRequest(user.id)}
            width="10px" height="10px"
          >
            Send
          </Button>
        </Paper>
      ))}
    </Stack>
  );
};

export default FindFriend;
