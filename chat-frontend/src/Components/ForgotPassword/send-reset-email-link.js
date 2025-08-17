import React, { useState } from 'react';
import { SendResetPasswordEmail } from '../../api/api.js';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    height: '400px',
    justifyContent: 'center', // add this
    alignItems: 'stretch',    // optional
    padding: theme.spacing(5),
    gap: theme.spacing(2),
    margin: '30',
    position: 'relative',
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    [theme.breakpoints.up('sm')]: {
        width: '450px',
    },
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));


const SendEmail = styled(Stack)(({ theme }) => ({
    minHeight: '50vh',
    width: '100%',
    padding: theme.spacing(2),
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(to bottom right, #f0f4ff, #ffffff)', // optional
    position: 'relative', // keep for background layering
    overflowY: 'auto',


    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        backgroundImage:
            'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
        backgroundRepeat: 'no-repeat',
        ...theme.applyStyles('dark', {
            backgroundImage:
                'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
        }),
    },
}));



function Send_Reset_Email_Link() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleSendEmail = async (e) => {
        setSnackbarOpen(true);
        e.preventDefault();
        try {
            const response = await SendResetPasswordEmail(email);
            setMessage(response.msg);
            setError("");
        } catch (err) {
            setError(err.response?.data?.email || "something went wrong");
            setMessage("");
        }
    };

    const handleSnackbarClose = () => setSnackbarOpen(false);

    return (
        <SendEmail justifyContent={'center'} alignItems={'center'}>
            <CssBaseline />
            <Card component="form" onSubmit={handleSendEmail}>
                <Typography textAlign={'center'} fontWeight={'bold'} fontSize={'30px'}>
                    Forgot Password
                </Typography>
                <Stack spacing={2}>
                    <TextField
                        label="Enter your email"
                        type='email'
                        name='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        required
                    />

                    <Button variant="contained" color="primary" type="submit" fullWidth>
                        Send Reset Link
                    </Button>

                </Stack>
            </Card>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    Sent successfully, Check Your Email!
                </Alert>
            </Snackbar>

        </SendEmail>
    );
};
export default Send_Reset_Email_Link;

// <div>
//     <h2>Forgot Password</h2>
//     <form onSubmit={handleSendEmail}>
//         <label>
//             Enter your email:
//             <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//             />
//         </label>
//         <button type="submit">Send Reset Link</button>
//     </form>
//     {message && <p style={{ color: "green" }}>{message}</p>}
//     {error && <p style={{ color: "red" }}>{error}</p>}
// </div>



