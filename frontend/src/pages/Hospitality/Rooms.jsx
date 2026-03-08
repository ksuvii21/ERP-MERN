import React from 'react';
import { Container, Typography } from '@mui/material';

const Rooms = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Room Management
      </Typography>
      {/* TODO: Add room status, types, and availability management */}
    </Container>
  );
};

export default Rooms;