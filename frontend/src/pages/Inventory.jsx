import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Add } from '@mui/icons-material';

const Inventory = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Inventory Management</Typography>
        <Button variant="contained" startIcon={<Add />}>
          Add Product
        </Button>
      </Box>
      <Paper sx={{ p: 3 }}>
        <Typography>Inventory list will appear here.</Typography>
      </Paper>
    </Box>
  );
};

export default Inventory;