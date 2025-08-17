import React, { useState } from 'react';
import { registerUser } from '../api/api'; // Import the API function
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';


const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    height: '600px',
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

const SignUpContainer = styled(Stack)(({ theme }) => ({
    minHeight: '100vh',
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

function Register() {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        password2: '',
        tc: false,
        first_name: '',
        last_name: '',
    });
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    // const [focusedField, setFocusedField] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);


    const validate = () => {
        const newErrors = {};

        // username validation
        if (!formData.username) {
            newErrors.username = 'Username is required!';
        }
        else if (!/^[a-zA-Z0-9_]{3,8}$/.test(formData.username)) {
            newErrors.username = 'Username must be 3-8 character and contain no special character';
        }

        // email validation
        if (!formData.email) {
            newErrors.email = 'Email is required!';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid email format!';
        }

        // password validation
        if (!formData.password) {
            newErrors.password = 'Password is required!';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password length should be at least 8 character!';
        } else if (!/[A-Z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one uppercase letter and one number';
        }

        // confirm password 
        if (!formData.password2) {
            newErrors.password2 = 'Confirm password is required!';
        } else if (formData.password !== formData.password2) {
            newErrors.password2 = 'Password do not match!';
        }

        setError(newErrors);
        return Object.keys(newErrors).length === 0; // return true if no errors
    };

    const handleChange = (e) => {
        if (e.target.name === 'tc') {
            setFormData({ ...formData, [e.target.name]: e.target.checked });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Clear previous errors
        setSuccessMessage(null);
        setSnackbarOpen(true);
        if (validate()) {
            console.log('Form submitted:', formData);
            try {
                const data = await registerUser(formData);
                console.log('Registration successful:', data);
                alert("Registration Successful!");
                setFormData({ email: '', username: '', password: '', password2: '', tc: false, first_name: '', last_name: '' });
            } catch (error) {
                console.log('Registration error:', error);
                setError(error.message || 'An unexpected error occurred.');
            }
        }
    };
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowPassword2 = () => setShowPassword2((show) => !show);
    const handleSnackbarClose = () => setSnackbarOpen(false);


    return (
        <SignUpContainer justifyContent="center" alignItems="center">
            <CssBaseline />
            <Card component="form" onSubmit={handleSubmit}>
                <Stack spacing={2}>

                    <Typography variant="h5" textAlign="center" fontWeight="bold">
                        Sign-Up
                    </Typography>

                    <TextField
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        error={Boolean(error?.username)}
                        helperText={error?.username}
                        fullWidth
                    />

                    <Stack direction="row" spacing={2}>
                        <TextField
                            label="First name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            error={Boolean(error?.first_name)}
                            helperText={error?.first_name}
                            fullWidth
                        />
                        <TextField
                            label="last name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            error={Boolean(error?.last_name)}
                            helperText={error?.last_name}
                            fullWidth
                        />
                    </Stack>

                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={Boolean(error?.email)}
                        helperText={error?.email}
                        fullWidth
                    />
                    <TextField
                        label="Password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
                        error={Boolean(error?.password)}
                        helperText={error?.password}
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleClickShowPassword} edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        label="Confirm Password"
                        name="password2"
                        type={showPassword2 ? 'text' : 'password'}
                        value={formData.password2}
                        onChange={handleChange}
                        error={Boolean(error?.password2)}
                        helperText={error?.password2}
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleClickShowPassword2} edge="end">
                                        {showPassword2 ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                name="tc"
                                checked={formData.tc}
                                onChange={handleChange}
                            />
                        }
                        label="I agree to the Terms and Conditions"
                    />

                    <Button variant="contained" color="primary" type="submit" fullWidth>
                        Register
                    </Button>

                    {successMessage && (
                        <Typography color="success.main" textAlign="center">
                            {successMessage}
                        </Typography>
                    )}

                    {error && typeof error === 'string' && (
                        <Typography color="error" textAlign="center">
                            {error}
                        </Typography>
                    )}
                </Stack>
            </Card>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical:'top', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    Registration successful!
                </Alert>
            </Snackbar>

        </SignUpContainer>
    );
};

export default Register;
