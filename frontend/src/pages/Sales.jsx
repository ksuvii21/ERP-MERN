import React from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { Add } from '@mui/icons-material';

const sampleSales = [
  { id: 'ORD-001', customer: 'Acme Corp', date: '2023-10-25', total: 1250.00, status: 'Completed' },
  { id: 'ORD-002', customer: 'Globex Inc', date: '2023-10-26', total: 450.50, status: 'Pending' },
  { id: 'ORD-003', customer: 'Soylent Corp', date: '2023-10-27', total: 2300.00, status: 'Shipped' },
  { id: 'ORD-004', customer: 'Initech', date: '2023-10-28', total: 150.00, status: 'Cancelled' },
];

const Sales = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Sales Orders</Typography>
        <Button variant="contained" startIcon={<Add />}>
          Create Order
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="sales table">
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Total ($)</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sampleSales.map((row) => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">{row.id}</TableCell>
                <TableCell>{row.customer}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell align="right">{row.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Chip
                    label={row.status}
                    color={row.status === 'Completed' ? 'success' : row.status === 'Pending' ? 'warning' : row.status === 'Cancelled' ? 'error' : 'primary'}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Sales;