import React, { useState } from 'react';
import { login } from '../api/api';
import { Link } from 'react-router-dom';
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

const LoginContainer = styled(Stack)(({ theme }) => ({
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

function Login() {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [error, setError] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSnackbarOpen(true);
        try {
            const data = await login(credentials);
            console.log("user", data);

            // Store tokens in localStorage
            sessionStorage.setItem('access_token', data.access);

            sessionStorage.setItem('refresh_token', data.refresh);

            sessionStorage.setItem("user", JSON.stringify(data.user));
            console.log("user data", data.user);

            console.log('Login successful!');
            // Redirect to profile page
            // window.location.href = '/profile';
        } catch (error) {
            console.log('Password does not match', error);
        }
    };

    const handleSnackbarClose = () => setSnackbarOpen(false);

    return (
        <LoginContainer justifyContent="center" alignItems={'center'}>
            <CssBaseline />
            <Card component="form" onSubmit={handleSubmit}>
                <Stack spacing={2}>
                    <Typography textAlign={'center'} fontWeight={'bold'} fontSize={'30px'}>
                        Login
                    </Typography>
                    <TextField
                        label="Email"
                        name="email"
                        type='email'
                        onChange={handleChange}
                        value={credentials.email}
                        fullWidth
                    />
                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        onChange={handleChange}
                        value={credentials.password}
                        fullWidth
                    />
                    <Link to="/forgot-password" style={{ textDecoration: 'none' }} target='_blank'>
                        <Button variant="text" color="primary">
                            Forgot password?
                        </Button>
                    </Link>

                    <Button variant="contained" color="primary" type="submit" fullWidth>
                        Login
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
                    Login successful!
                </Alert>
            </Snackbar>
        </LoginContainer>

    )
};

export default Login;



//         <div>
//             <h2>Login</h2>
//             {error && <div style={{ color: 'red' }}>{error}</div>}
//             <form onSubmit={handleSubmit}>
//                 <div>
//                     <label>Email:</label>
//                     <input
//                         type="email"
//                         name="email"
//                         placeholder="Email"
//                         value={credentials.email}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>
//                 <div>
//                     <label>Password:</label>
//                     <input
//                         type="password"
//                         name="password"
//                         placeholder="Password"
//                         value={credentials.password}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>
//                 <button type="submit">Login</button><br/><br/>
//                 <button>
//                     <Link to="/forgot-password" target="_self" style={linkStyle}>Forgot password</Link>
//                 </button>
//             </form>
//         </div>
//     );
// }

// const linkStyle = {
//     color: 'Black',
//     textDecoration: 'none',
// };

