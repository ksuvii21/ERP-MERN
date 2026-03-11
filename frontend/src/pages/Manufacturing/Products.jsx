import React from 'react';
import { Container, Typography } from '@mui/material';

const ManufacturingProducts = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Manufacturing Products
      </Typography>
      {/* TODO: Display list of manufacturable products, link to BOMs */}
    </Container>
  );
};

export default ManufacturingProducts;