import React from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { Add } from '@mui/icons-material';

const samplePurchases = [
  { id: 'PO-001', supplier: 'Tech Supplies Co', date: '2023-10-20', total: 5000.00, status: 'Received' },
  { id: 'PO-002', supplier: 'Office Depot', date: '2023-10-22', total: 350.00, status: 'Pending' },
  { id: 'PO-003', supplier: 'Furniture World', date: '2023-10-24', total: 1200.00, status: 'Ordered' },
];

const Purchases = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Purchase Orders</Typography>
        <Button variant="contained" startIcon={<Add />}>
          New Purchase
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="purchases table">
          <TableHead>
            <TableRow>
              <TableCell>PO Number</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Total ($)</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {samplePurchases.map((row) => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">{row.id}</TableCell>
                <TableCell>{row.supplier}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell align="right">{row.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Chip
                    label={row.status}
                    color={row.status === 'Received' ? 'success' : 'warning'}
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

export default Purchases;