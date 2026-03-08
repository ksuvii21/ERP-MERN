import React from 'react';
import { Container, Typography } from '@mui/material';

const CRM = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        CRM (Customer Relationship Management)
      </Typography>
      {/* TODO: Add lead tracking, contact management, and sales pipeline */}
    </Container>
  );
};

export default CRM;