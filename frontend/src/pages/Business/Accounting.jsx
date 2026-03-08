import React from 'react';
import { Container, Typography } from '@mui/material';

const Accounting = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Accounting (GL/AP/AR)
      </Typography>
      {/* TODO: Add General Ledger, Accounts Payable, and Accounts Receivable functionality */}
    </Container>
  );
};

export default Accounting;