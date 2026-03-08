import React from 'react';
import { Container, Typography } from '@mui/material';

const Guests = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Guest Management
      </Typography>
      {/* TODO: Add guest profiles, history, and preferences */}
    </Container>
  );
};

export default Guests;