import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip } from '@mui/material';
import { Add } from '@mui/icons-material';

const Payroll = () => {
  // Mock data
  const payrolls = [
    { id: 1, employee: 'Alice Johnson', month: 'January', amount: 4500, status: 'Paid' },
    { id: 2, employee: 'Bob Smith', month: 'January', amount: 4200, status: 'Pending' },
    { id: 3, employee: 'Charlie Brown', month: 'January', amount: 3800, status: 'Processing' },
  ];

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">Payroll Management</Typography>
        <Button variant="contained" startIcon={<Add />}>Process Payroll</Button>
      </Box>
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f8fafc' }}>
            <TableRow>
              <TableCell><strong>Employee</strong></TableCell>
              <TableCell><strong>Month</strong></TableCell>
              <TableCell><strong>Amount</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payrolls.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{row.employee}</TableCell>
                <TableCell>{row.month}</TableCell>
                <TableCell>${row.amount}</TableCell>
                <TableCell>
                  <Chip label={row.status} color={row.status === 'Paid' ? 'success' : row.status === 'Pending' ? 'warning' : 'default'} size="small" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Payroll;