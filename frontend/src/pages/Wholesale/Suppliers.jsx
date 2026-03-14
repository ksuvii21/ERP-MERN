import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, CircularProgress,
  Box, Modal, TextField
} from '@mui/material';
import { Add, Business } from '@mui/icons-material';
import api from '../../utils/api';

const style = {
  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
  width: 450, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, p: 4,
};

const WholesaleSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    category: ''
  });

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      // Using the generic suppliers route
      const res = await api.get('suppliers');
      setSuppliers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSuppliers(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('suppliers', formData);
      setOpen(false);
      setFormData({ name: '', contactPerson: '', email: '', category: '' });
      fetchSuppliers();
    } catch (err) {
      alert('Error adding supplier');
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box>;

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" mb={4} alignItems="center">
        <Box display="flex" alignItems="center" gap={2}>
          <Business color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h4" fontWeight="bold">Wholesale Suppliers</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
          Register Supplier
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell>Company Name</TableCell>
              <TableCell>Contact Person</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Category</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers.map((sup) => (
              <TableRow key={sup._id} hover>
                <TableCell sx={{ fontWeight: 'medium' }}>{sup.name}</TableCell>
                <TableCell>{sup.contactPerson || 'N/A'}</TableCell>
                <TableCell>{sup.email}</TableCell>
                <TableCell>{sup.category || 'General'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <Typography variant="h6" mb={3}>Register New Supplier</Typography>
          <form onSubmit={handleSubmit}>
            <TextField 
              fullWidth label="Company Name" required sx={{ mb: 2 }}
              value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <TextField 
              fullWidth label="Contact Person" sx={{ mb: 2 }}
              value={formData.contactPerson} onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
            />
            <TextField 
              fullWidth label="Email" type="email" required sx={{ mb: 2 }}
              value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <TextField 
              fullWidth label="Category" placeholder="e.g., Electronics, Food" sx={{ mb: 3 }}
              value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}
            />
            <Button type="submit" variant="contained" fullWidth size="large">Register Supplier</Button>
          </form>
        </Box>
      </Modal>
    </Container>
  );
};

export default WholesaleSuppliers;