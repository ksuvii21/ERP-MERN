import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, TextField, Typography, Container, Paper, Avatar, Grid, InputAdornment, IconButton, CircularProgress, useTheme } from '@mui/material';
import { LockOutlined, Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
// import { login, reset } from '../features/auth/authSlice'; // Uncomment when authSlice is ready

const Login = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { email, password } = formData;
    const [showPassword, setShowPassword] = useState(false);

    const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth || {});

    useEffect(() => {
        if (isError) toast.error(message);
        if (isSuccess || user) navigate('/app/dashboard');
        // dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    const onChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const onSubmit = (e) => {
        e.preventDefault();
        const userData = { email, password };
        // dispatch(login(userData));
        console.log("Login Attempt:", userData);
    };

    return (
        <Box 
            sx={{ 
                minHeight: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: theme.palette.mode === 'dark' 
                    ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' 
                    : 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)'
            }}
        >
            <Container component="main" maxWidth="xs">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <Paper elevation={6} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 3 }}>
                        <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56 }}>
                            <LockOutlined fontSize="large" />
                        </Avatar>
                        <Typography component="h1" variant="h5" fontWeight="bold" gutterBottom>
                            Welcome Back
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={3}>
                            Sign in to continue to ERP System
                        </Typography>

                        <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                value={email}
                                onChange={onChange}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Email color="action" /></InputAdornment>,
                                }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={onChange}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Lock color="action" /></InputAdornment>,
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                            
                            <Box display="flex" justifyContent="flex-end" mt={1}>
                                <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                                    <Typography variant="body2" color="primary" fontWeight={500}>
                                        Forgot password?
                                    </Typography>
                                </Link>
                            </Box>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 'bold' }}
                                disabled={isLoading}
                            >
                                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                            </Button>
                            
                            <Grid container justifyContent="center">
                                <Grid item>
                                    <Typography variant="body2" color="text.secondary">
                                        Don't have an account?{' '}
                                        <Link to="/register" style={{ textDecoration: 'none' }}>
                                            <Typography component="span" variant="body2" color="primary" fontWeight="bold">
                                                Sign Up
                                            </Typography>
                                        </Link>
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </motion.div>
            </Container>
        </Box>
    );
};

export default Login;