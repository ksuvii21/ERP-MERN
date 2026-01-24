import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Add } from '@mui/icons-material';

const Users = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">User Management</Typography>
        <Button variant="contained" startIcon={<Add />}>
          Add User
        </Button>
      </Box>
      <Paper sx={{ p: 3 }}>
        <Typography>User list will appear here.</Typography>
      </Paper>
    </Box>
  );
};

export default Users;