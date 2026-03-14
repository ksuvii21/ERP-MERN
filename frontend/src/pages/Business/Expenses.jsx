import React from 'react';
import { Container, Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Add } from '@mui/icons-material';

const Expenses = () => {
  return (
    <Container>
      <Box display="flex" justifyContent="space-between" mb={4} alignItems="center">
        <Typography variant="h4" fontWeight="bold">Expense Tracking</Typography>
        <Button variant="contained" color="error" startIcon={<Add />}>Record Expense</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow hover>
              <TableCell>2024-03-14</TableCell>
              <TableCell>Utilities</TableCell>
              <TableCell>Electricity Bill - Office</TableCell>
              <TableCell align="right" sx={{ color: 'error.main', fontWeight: 'bold' }}>$450.00</TableCell>
            </TableRow>
            <TableRow hover>
              <TableCell>2024-03-12</TableCell>
              <TableCell>Marketing</TableCell>
              <TableCell>Social Media Ads</TableCell>
              <TableCell align="right" sx={{ color: 'error.main', fontWeight: 'bold' }}>$1,200.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};
export default Expenses;