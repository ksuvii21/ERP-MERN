import React from 'react';
import { Box, Typography, Paper, Switch, FormControlLabel, Button, Divider, TextField } from '@mui/material';

const Settings = () => {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom fontWeight="bold">Settings</Typography>
      <Paper sx={{ p: 4, maxWidth: 600 }}>
        <Typography variant="h6" gutterBottom>Preferences</Typography>
        <FormControlLabel control={<Switch defaultChecked />} label="Enable Email Notifications" />
        <FormControlLabel control={<Switch />} label="Compact Mode" />
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h6" gutterBottom>Security</Typography>
        <Button variant="outlined" color="primary" sx={{ mr: 2 }}>Change Password</Button>
        <Button variant="outlined" color="error">Log Out All Devices</Button>
      </Paper>
    </Box>
  );
};

export default Settings;