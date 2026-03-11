import React from 'react';
import { Container, Typography } from '@mui/material';

const ProductionOrders = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Production Orders
      </Typography>
      {/* TODO: Display list of production orders, allow creation and status updates */}
    </Container>
  );
};

export default ProductionOrders;