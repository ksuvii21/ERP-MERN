import React from 'react';
import { Container, Typography } from '@mui/material';

const Inventory = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Retail Inventory
      </Typography>
      {/* TODO: Add stock levels, product management, and adjustments */}
    </Container>
  );
};

export default Inventory;