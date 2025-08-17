import React, { useEffect, useState } from "react";
import { viewFriendRequest, RespondToRequest } from "../api/api";
import {
  Avatar,
  Typography,
  Button,
  Snackbar,
  Stack,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";

const FriendRequests = () => {
  const [requests, setRequests] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await viewFriendRequest();
        if (response?.data) {
          setRequests(response.data);
        } else {
          console.error("Invalid data structure", response);
        }
      } catch (error) {
        console.error("Error fetching friend requests", error);
      }
    };
    fetchRequests();
  }, []);

  const handleResponse = async (request_id, action) => {
    try {
      await RespondToRequest(request_id, action);
      setRequests((prev) => prev.filter((req) => req.id !== request_id));
      setSnackbarMessage(
        action === "accept" ? "Friend request accepted!" : "Friend request rejected."
      );
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error responding to friend request", error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        padding: 4,
        background: "linear-gradient(to right, #f0f4ff, #ffffff)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Friend Requests
      </Typography>

      {requests.length === 0 ? (
        <Typography>No pending friend requests.</Typography>
      ) : (
        <Stack spacing={3} sx={{ width: "100%", maxWidth: 600 }}>
          {requests.map((req) => (
            <Card
              key={req.id}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 2,
                boxShadow: 3,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  src={req.sender?.profile_picture || ""}
                  alt={req.sender?.username}
                  sx={{ width: 56, height: 56 }}
                />
                <Box>
                  <Typography variant="subtitle1">
                    {req.sender?.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {req.sender?.email}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleResponse(req.id, "accept")}
                >
                  Accept
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleResponse(req.id, "reject")}
                >
                  Reject
                </Button>
              </Stack>
            </Card>
          ))}
        </Stack>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FriendRequests;
