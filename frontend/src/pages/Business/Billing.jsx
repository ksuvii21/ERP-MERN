import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Box } from '@mui/material';
import api from '../../utils/api';

const Billing = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await api.get('billing/invoices');
        setInvoices(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchInvoices();
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <Container>
      <Typography variant="h4" mb={4}>Billing & Invoices</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Invoice #</TableCell>
              <TableCell>Patient/Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.length === 0 ? (
               <TableRow><TableCell colSpan={5} align="center">No invoices found.</TableCell></TableRow>
            ) : (
              invoices.map((inv) => (
                <TableRow key={inv._id}>
                  <TableCell>{inv.invoiceNumber}</TableCell>
                  <TableCell>{inv.customerName}</TableCell>
                  <TableCell>{new Date(inv.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>${inv.totalAmount?.toFixed(2)}</TableCell>
                  <TableCell>
                    <span style={{ color: inv.status === 'Paid' ? 'green' : 'orange' }}>{inv.status}</span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};
export default Billing;