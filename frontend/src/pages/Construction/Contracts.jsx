import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Modal,
  Box,
  TextField,
  MenuItem,
  Chip
} from '@mui/material';
import { Add } from '@mui/icons-material';
import api from '../../utils/api';

const Contracts = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    contractorName: '',
    value: '',
    status: 'Pending',
    startDate: ''
  });

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const res = await api.get('construction/contracts');
      setContracts(res.data);
    } catch (err) {
      console.error('Error fetching contracts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('construction/contracts', formData);
      setOpen(false);
      setFormData({ title: '', contractorName: '', value: '', status: 'Pending', startDate: '' });
      fetchContracts();
    } catch (err) {
      alert('Error saving contract');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Pending': return 'warning';
      case 'Completed': return 'info';
      case 'Terminated': return 'error';
      default: return 'default';
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">Legal Contracts</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
          New Contract
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Contract Title</TableCell>
              <TableCell>Contractor</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contracts.map((c) => (
              <TableRow key={c._id} hover>
                <TableCell>{c.title}</TableCell>
                <TableCell>{c.contractorName}</TableCell>
                <TableCell>${c.value?.toLocaleString()}</TableCell>
                <TableCell>{c.startDate ? new Date(c.startDate).toLocaleDateString() : 'N/A'}</TableCell>
                <TableCell>
                  <Chip label={c.status} color={getStatusColor(c.status)} size="small" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 450, bgcolor: 'white', p: 4, borderRadius: 2, boxShadow: 24 }}>
          <Typography variant="h6" mb={2}>Register New Contract</Typography>
          <form onSubmit={handleSubmit}>
            <TextField label="Contract Title" fullWidth required sx={{ mb: 2 }} value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            <TextField label="Contractor Name" fullWidth required sx={{ mb: 2 }} value={formData.contractorName} onChange={(e) => setFormData({ ...formData, contractorName: e.target.value })} />
            <TextField label="Total Value" type="number" fullWidth required sx={{ mb: 2 }} value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })} />
            <TextField label="Start Date" type="date" fullWidth sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
            <TextField select label="Status" fullWidth sx={{ mb: 3 }} value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
              {['Pending', 'Active', 'Completed', 'Terminated'].map((s) => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </TextField>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" variant="contained">Create Contract</Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Container>
  );
};

export default Contracts;