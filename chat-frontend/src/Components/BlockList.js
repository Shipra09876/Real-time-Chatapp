import React, { useEffect, useState } from "react";
import { fetchBlockedUser, respondBlockUser } from "../api/api";
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


const BlockList = () => {
  const [blockList, setBlockList] = useState([]);
  const [snackbarMessage, setSnackbarMessage] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const loadBlockList = async () => {
      try {
        const response = await fetchBlockedUser();
        if (response?.data) {
          setBlockList(response.data);
        } else {
          console.error("Failed to fetch block list");
        }
      } catch (error) {
        console.error("Error fetching blocked users", error);
      }
    };
    loadBlockList();
  }, []);

  const handleUnblock = async (userId) => {
    try {
      const result = await respondBlockUser(userId, "unblock");
      if (result) {
        setBlockList((prev) => prev.filter((user) => user.blocked.id !== userId));
        setSnackbarMessage("User unblocked successfully!");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error unblocking user", error);
    }
  };

  return (
    <Box
      sx={{
        padding: 4,
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #f5f7fa, #ffffff)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Block Users
      </Typography>

      {blockList.length === 0 ? (
        <Typography>No blocked users.</Typography>
      ) : (
        <Stack spacing={3} sx={{ width: "100%", maxWidth: 600 }}>
          {blockList.map((entry) => (
            <Card
              key={entry.id}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 2,
                boxShadow: 2,
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  src={entry.blocked.profile_image || ""}
                  alt={entry.blocked.username}
                  sx={{ width: 56, height: 56 }}
                />
                <Box>
                  <Typography variant="subtitle1">
                    {entry.blocked.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {entry.blocked.email}
                  </Typography>
                </Box>
              </Stack>

              <Button
                variant="outlined"
                color="error"
                onClick={() => handleUnblock(entry.blocked.id)}
              >
                Unblock
              </Button>
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

export default BlockList;
