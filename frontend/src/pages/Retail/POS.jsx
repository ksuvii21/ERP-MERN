import React from 'react';
import { Container, Typography } from '@mui/material';

const POS = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Point of Sale (POS)
      </Typography>
      {/* TODO: Add product selection, cart, and checkout functionality */}
    </Container>
  );
};

export default POS;