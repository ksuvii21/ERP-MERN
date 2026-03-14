import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Paper, Box, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import api from '../../utils/api';

const Accounting = () => {
  const [ledgers, setLedgers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Placeholder for accounting data
        setLoading(false);
      } catch (err) { console.error(err); }
    };
    fetchData();
  }, []);

  if (loading) return <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box>;

  return (
    <Container>
      <Typography variant="h4" fontWeight="bold" mb={4}>Accounting & General Ledger</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell>Account Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow hover>
              <TableCell sx={{ fontWeight: 'medium' }}>Cash in Hand</TableCell>
              <TableCell>Asset</TableCell>
              <TableCell align="right">$12,450.00</TableCell>
            </TableRow>
            <TableRow hover>
              <TableCell sx={{ fontWeight: 'medium' }}>Accounts Receivable</TableCell>
              <TableCell>Asset</TableCell>
              <TableCell align="right">$8,200.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};
export default Accounting;