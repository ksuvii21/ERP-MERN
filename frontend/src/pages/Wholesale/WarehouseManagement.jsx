import React from 'react';
import { Container, Typography } from '@mui/material';

const WarehouseManagement = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Warehouse Management (WMS)
      </Typography>
      {/* TODO: Add inventory tracking, bin locations, and stock movement functionality */}
    </Container>
  );
};

export default WarehouseManagement;