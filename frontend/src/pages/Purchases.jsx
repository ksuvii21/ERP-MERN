import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Add } from '@mui/icons-material';

const Purchases = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Purchase Orders</Typography>
        <Button variant="contained" startIcon={<Add />}>
          New Purchase
        </Button>
      </Box>
      <Paper sx={{ p: 3 }}>
        <Typography>Purchase history will appear here.</Typography>
      </Paper>
    </Box>
  );
};

export default Purchases;