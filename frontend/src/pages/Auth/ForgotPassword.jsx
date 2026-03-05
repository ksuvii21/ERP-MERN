import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, TextField, Typography, Container, Paper, Avatar, useTheme, InputAdornment } from '@mui/material';
import { LockReset, Email, ArrowBack } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
    const theme = useTheme();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter your email");
            return;
        }
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            toast.success("Password reset link sent to your email!");
        }, 2000);
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
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Paper 
                        elevation={6} 
                        sx={{ 
                            p: 4, 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center',
                            borderRadius: 3,
                            backgroundColor: theme.palette.background.paper
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: 56, height: 56 }}>
                            <LockReset fontSize="large" />
                        </Avatar>
                        <Typography component="h1" variant="h5" fontWeight="bold" gutterBottom>
                            Reset Password
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center" mb={3}>
                            Enter your email address and we'll send you a link to reset your password.
                        </Typography>

                        <Box component="form" onSubmit={onSubmit} noValidate sx={{ width: '100%' }}>
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
                                onChange={(e) => setEmail(e.target.value)}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Email color="action" /></InputAdornment>,
                                }}
                            />
                            <Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 3, mb: 2, py: 1.5 }} disabled={isLoading}>
                                {isLoading ? 'Sending...' : 'Send Reset Link'}
                            </Button>
                            <Button component={Link} to="/login" fullWidth startIcon={<ArrowBack />} sx={{ mt: 1 }}>
                                Back to Login
                            </Button>
                        </Box>
                    </Paper>
                </motion.div>
            </Container>
        </Box>
    );
};

export default ForgotPassword;