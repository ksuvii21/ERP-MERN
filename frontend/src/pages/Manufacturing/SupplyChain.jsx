import React from 'react';
import { Container, Typography } from '@mui/material';

const SupplyChain = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Supply Chain Overview
      </Typography>
      {/* TODO: Display supply chain visualization, from suppliers to production to customers */}
    </Container>
  );
};

export default SupplyChain;