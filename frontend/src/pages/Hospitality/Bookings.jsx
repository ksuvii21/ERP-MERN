import React from 'react';
import { Container, Typography } from '@mui/material';

const Bookings = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Booking Management
      </Typography>
      {/* TODO: Add booking calendar, new reservations, and check-in/out */}
    </Container>
  );
};

export default Bookings;