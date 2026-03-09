import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Paper, Grid, Chip, CircularProgress, Alert } from '@mui/material';
import { ShieldCheck, UserCircle, Briefcase, Building } from 'lucide-react';
import api from '../../utils/api';

const ProfilePage = () => {
  const { user: authUser } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // This new endpoint fetches the currently logged-in user's full profile
        const { data } = await api.get('/api/users/me');
        setProfile(data);
        setError('');
      } catch (err) {
        setError('Failed to fetch profile data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!profile) {
    return <Alert severity="warning">No profile data found.</Alert>;
  }

  return (
    <Paper sx={{ p: 4, maxWidth: 900, margin: 'auto', borderRadius: 3, boxShadow: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold', color: 'primary.main' }}>
        <UserCircle size={32} /> User Profile
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" color="text.secondary">Account Details</Typography>
          <Box sx={{ mt: 1, pl: 1 }}>
            <Typography><strong>Name:</strong> {profile.name}</Typography>
            <Typography><strong>Email:</strong> {profile.email}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" color="text.secondary">Company & Role</Typography>
          <Box sx={{ mt: 1, pl: 1 }}>
            <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Building size={16} /> <strong>Company:</strong> {profile.company?.name}</Typography>
            <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Briefcase size={16} /> <strong>Industry:</strong> {profile.company?.industryType}</Typography>
            <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}><ShieldCheck size={16} /> <strong>Role:</strong> <Chip label={profile.role} color="primary" size="small" sx={{ textTransform: 'capitalize' }} /></Typography>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold' }}>
          <ShieldCheck size={28} /> Your Permissions
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Your role grants you the following permissions within the system.
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, p: 2, background: '#f7f7f7', borderRadius: 2 }}>
          {profile.permissions && profile.permissions.length > 0 ? (
            profile.permissions.sort().map((permission) => (
              <Chip key={permission} label={permission} variant="outlined" color="success" size="small" />
            ))
          ) : (
            <Chip label="No specific permissions assigned." variant="outlined" color="warning" />
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default ProfilePage;