import React, { useState, useEffect } from 'react';
import { getProfile, uploadProfilePicture } from '../api/api.js';
import {
    Card as MuiCard,
    CardContent,
    Avatar,
    Typography,
    Button,
    Snackbar,
    Alert,
    Stack,
    CircularProgress,
    Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import UploadIcon from '@mui/icons-material/Upload';

const ProfileContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(to right, #e3f2fd, #fff)',
    padding: theme.spacing(3),
}));

const Card = styled(MuiCard)(({ theme }) => ({
    maxWidth: 500,
    padding: theme.spacing(4),
    boxShadow: theme.shadows[5],
    borderRadius: theme.spacing(2),
    backgroundColor: '#fafafa',
}));

const UploadSection = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(0),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(1),
}));


const Profile = ({ accessToken }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getProfile(accessToken);
                setProfile(data);
            } catch (err) {
                setError(err.message || 'Failed to fetch profile');
            } finally {
                setLoading(false);
            }
        };

        if (accessToken) fetchProfile();
        else {
            setError("Access token is missing");
            setLoading(false);
        }
    }, [accessToken]);

    const handleImageChange = (e) => {
        setSelectedImage(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedImage) return alert("No image selected");
        try {
            const updated = await uploadProfilePicture(selectedImage, accessToken);
            setProfile(updated);
            setSnackbarOpen(true);
        } catch (err) {
            console.error("Upload error", err);
            alert("Failed to upload image");
        }
    };

    const handleSnackbarClose = () => setSnackbarOpen(false);

    if (loading) {
        return (
            <ProfileContainer>
                <CircularProgress />
            </ProfileContainer>
        );
    }

    if (error) {
        return (
            <ProfileContainer>
                <Alert severity="error">{error}</Alert>
            </ProfileContainer>
        );
    }
    const handleUserLoggedOut = () => {
        sessionStorage.removeItem('accessToken');
        window.location.href = '/login';
    };

    return (
        <ProfileContainer>
            <Card>
                <CardContent>
                    <Stack spacing={2} alignItems="center">
                        <Avatar
                            variant='circle'
                            src={profile?.profile_picture ? `http://127.0.0.1:8000${profile.profile_picture}` : ''}

                            alt="Profile"

                            sx={{ width: "150px", height: '150px' }}
                        />
                        <Typography variant="h6" fontWeight={'bold'}>{profile.first_name} {profile.last_name}</Typography>
                        <Stack spacing={2} sx={{ width: '100%' }}>
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="subtitle2" fontWeight="bold">Email</Typography>
                                <Typography variant="body2" sx={{ maxWidth: '70%', textAlign: 'right' }}>
                                    {profile.email}
                                </Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="subtitle2" fontWeight="bold">Username</Typography>
                                <Typography variant="body2" sx={{ maxWidth: '100%', textAlign: 'right' }}>
                                    {profile.username}
                                </Typography>
                            </Box>
                        </Stack>


                        <UploadSection>
                            <Stack
                                direction="row"
                                spacing={2}
                                alignItems="flex-start"
                                sx={{ mt: 3 }}
                            >
                                <input
                                    accept="image/*"
                                    id="upload-image"
                                    type="file"
                                    style={{ display: 'none' }}
                                    onChange={handleImageChange}
                                />
                                <label htmlFor="upload-image">
                                    <Button
                                        variant="outlined"
                                        component="span"
                                        color="primary"
                                        startIcon={<UploadIcon />}

                                    >
                                    </Button>
                                </label>
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={handleUpload}
                                    sx={{ width: '90px', height: '30px' }}
                                >
                                    Upload
                                </Button>
                            </Stack>
                        </UploadSection>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => {
                                // clear token or session
                                sessionStorage.removeItem('accessToken');
                                // call logout handler if needed
                                handleUserLoggedOut?.();
                            }}
                        >
                            Logout
                        </Button>

                    </Stack>
                </CardContent>
            </Card>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity="success" variant="filled">
                    Profile picture updated successfully!
                </Alert>
            </Snackbar>
        </ProfileContainer>
    );
};

export default Profile;
