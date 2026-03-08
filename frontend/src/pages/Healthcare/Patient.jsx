import React from 'react';
import { Container, Typography } from '@mui/material';

const Patients = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Patients Management
      </Typography>
      {/* TODO: Add patient list, search, and add new patient functionality */}
    </Container>
  );
};

export default Patients;

