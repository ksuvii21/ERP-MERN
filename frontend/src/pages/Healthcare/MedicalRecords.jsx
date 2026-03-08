import React from 'react';
import { Container, Typography } from '@mui/material';

const MedicalRecords = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Medical Records
      </Typography>
      {/* TODO: Add medical record search, view, and creation functionality */}
    </Container>
  );
};

export default MedicalRecords;