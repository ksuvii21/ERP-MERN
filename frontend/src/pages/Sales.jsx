import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Add } from '@mui/icons-material';

const Sales = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Sales Orders</Typography>
        <Button variant="contained" startIcon={<Add />}>
          Create Order
        </Button>
      </Box>
      <Paper sx={{ p: 3 }}>
        <Typography>Sales records will appear here.</Typography>
      </Paper>
    </Box>
  );
};

export default Sales;