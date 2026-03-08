import React from 'react';
import { Container, Typography } from '@mui/material';

const Pharmacy = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Pharmacy Management
      </Typography>
      {/* TODO: Add inventory management, prescription processing, and sales */}
    </Container>
  );
};

export default Pharmacy;