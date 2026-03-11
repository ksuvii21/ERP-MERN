import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Paper, Grid, CircularProgress, Alert } from '@mui/material';
import API from '../../utils/api';

const Profile = () => {
  const { user: authUser } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError('');
        // The request URL must be relative to the Axios base URL.
        // Using a full path like '/api/users/me' would cause a duplicate '/api' segment.
        const { data } = await API.get('users/me');
        setProfile(data);
      } catch (err) {
        console.error('Failed to fetch profile', err);
        setError('Failed to load profile data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="calc(100vh - 200px)">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  // Use fetched profile data, but fall back to Redux state if needed
  const user = profile || authUser;

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        My Profile
      </Typography>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="text.secondary">Full Name</Typography>
            <Typography variant="h6">{user.name}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="text.secondary">Email Address</Typography>
            <Typography variant="h6">{user.email}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="text.secondary">Role</Typography>
            <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>{user.role}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="text.secondary">Status</Typography>
            <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>{user.status}</Typography>
          </Grid>
          {user.company && (
            <>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" color="text.secondary">Company</Typography>
                <Typography variant="h6">{user.company.name}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" color="text.secondary">Industry</Typography>
                <Typography variant="h6">{user.company.industryType}</Typography>
              </Grid>
            </>
          )}
        </Grid>
      </Paper>
    </Box>
  );
};

export default Profile;