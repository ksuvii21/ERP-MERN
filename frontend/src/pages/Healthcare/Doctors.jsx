import React from 'react';
import { Container, Typography } from '@mui/material';

const Doctors = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Doctors Management
      </Typography>
      {/* TODO: Add doctor list, search, and add new doctor functionality */}
    </Container>
  );
};

export default Doctors;