import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, CircularProgress,
  Box, Modal, TextField, MenuItem, Chip
} from '@mui/material';
import { Add, AccountBalanceWallet } from '@mui/icons-material';
import api from '../../utils/api';

const style = {
  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
  width: 450, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, p: 4,
};

const CreditManagement = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    creditLimit: '',
    paymentTerms: 'Net 30'
  });

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const res = await api.get('wholesale/credit-accounts');
      setAccounts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAccounts(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('wholesale/credit-accounts', formData);
      setOpen(false);
      setFormData({ customerName: '', creditLimit: '', paymentTerms: 'Net 30' });
      fetchAccounts();
    } catch (err) {
      alert('Error creating credit account');
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box>;

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" mb={4} alignItems="center">
        <Box display="flex" alignItems="center" gap={2}>
          <AccountBalanceWallet color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h4" fontWeight="bold">Credit Management</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
          Add Account
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell>Customer Name</TableCell>
              <TableCell>Credit Limit</TableCell>
              <TableCell>Current Balance</TableCell>
              <TableCell>Terms</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts.map((acc) => (
              <TableRow key={acc._id} hover>
                <TableCell sx={{ fontWeight: 'medium' }}>{acc.customerName}</TableCell>
                <TableCell>${acc.creditLimit?.toLocaleString()}</TableCell>
                <TableCell color={acc.currentBalance > acc.creditLimit ? 'error.main' : 'inherit'}>
                  ${acc.currentBalance?.toLocaleString()}
                </TableCell>
                <TableCell>{acc.paymentTerms}</TableCell>
                <TableCell>
                  <Chip 
                    label={acc.status} 
                    size="small" 
                    color={acc.status === 'Active' ? 'success' : 'error'} 
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <Typography variant="h6" mb={3}>Setup Credit Account</Typography>
          <form onSubmit={handleSubmit}>
            <TextField 
              fullWidth label="Customer Name" required sx={{ mb: 2 }}
              value={formData.customerName} onChange={(e) => setFormData({...formData, customerName: e.target.value})}
            />
            <TextField 
              fullWidth label="Credit Limit" type="number" required sx={{ mb: 2 }}
              value={formData.creditLimit} onChange={(e) => setFormData({...formData, creditLimit: e.target.value})}
            />
            <TextField 
              select fullWidth label="Payment Terms" sx={{ mb: 3 }}
              value={formData.paymentTerms} onChange={(e) => setFormData({...formData, paymentTerms: e.target.value})}
            >
              {['Net 15', 'Net 30', 'Net 60', 'Due on Receipt'].map(term => (
                <MenuItem key={term} value={term}>{term}</MenuItem>
              ))}
            </TextField>
            <Button type="submit" variant="contained" fullWidth size="large">Create Account</Button>
          </form>
        </Box>
      </Modal>
    </Container>
  );
};

export default CreditManagement;