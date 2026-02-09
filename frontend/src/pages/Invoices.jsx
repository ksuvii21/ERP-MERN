import React, { useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip, IconButton } from '@mui/material';
import { Add, Download, Send } from '@mui/icons-material';

const Invoices = () => {
  const [invoices] = useState([
    { id: 'INV-001', client: 'Acme Corp', amount: 1200, date: '2026-02-01', status: 'Paid' },
    { id: 'INV-002', client: 'Globex Inc', amount: 3400, date: '2026-02-05', status: 'Pending' },
    { id: 'INV-003', client: 'Soylent Corp', amount: 850, date: '2026-02-08', status: 'Overdue' },
  ]);

  const getStatusColor = (status) => {
    switch(status) {
        case 'Paid': return 'success';
        case 'Pending': return 'warning';
        case 'Overdue': return 'error';
        default: return 'default';
    }
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">Invoices</Typography>
        <Button variant="contained" startIcon={<Add />}>Create Invoice</Button>
      </Box>

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f8fafc' }}>
            <TableRow>
              <TableCell><strong>Invoice #</strong></TableCell>
              <TableCell><strong>Client</strong></TableCell>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Amount</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((inv) => (
              <TableRow key={inv.id} hover>
                <TableCell>{inv.id}</TableCell>
                <TableCell>{inv.client}</TableCell>
                <TableCell>{inv.date}</TableCell>
                <TableCell>${inv.amount}</TableCell>
                <TableCell>
                    <Chip label={inv.status} color={getStatusColor(inv.status)} size="small" />
                </TableCell>
                <TableCell>
                    <IconButton size="small" color="primary"><Send /></IconButton>
                    <IconButton size="small"><Download /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Invoices;