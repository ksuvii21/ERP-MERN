import React from 'react';
import { Container, Typography } from '@mui/material';

const Services = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Hotel Services
      </Typography>
      {/* TODO: Add room service, housekeeping, and other amenities management */}
    </Container>
  );
};

export default Services;