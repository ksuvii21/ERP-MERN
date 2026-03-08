import React from 'react';
import { Container, Typography } from '@mui/material';

const Expenses = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Expense Management
      </Typography>
      {/* TODO: Add expense reporting, approval workflows, and reimbursement tracking */}
    </Container>
  );
};

export default Expenses;