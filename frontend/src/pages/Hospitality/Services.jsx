import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Button, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, CircularProgress, Box, Modal, TextField, MenuItem 
} from '@mui/material';
import { Add } from '@mui/icons-material';
import api from '../../utils/api';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', category: '', price: '' });

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await api.get('hospitality/services');
      setServices(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchServices(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('hospitality/services', formData);
      setOpen(false);
      setFormData({ name: '', category: '', price: '' });
      fetchServices();
    } catch (err) { alert('Error adding service'); }
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">Hotel Services</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>Add Service</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell>Service Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((s) => (
              <TableRow key={s._id} hover>
                <TableCell sx={{ fontWeight: 'medium' }}>{s.name}</TableCell>
                <TableCell>{s.category}</TableCell>
                <TableCell>${s.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'white', p: 4, borderRadius: 2 }}>
          <Typography variant="h6" mb={2}>Add New Service</Typography>
          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="Service Name" required sx={{ mb: 2 }} value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <TextField select fullWidth label="Category" required sx={{ mb: 2 }} value={formData.category} 
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
              {['Food & Beverage', 'Spa & Wellness', 'Laundry', 'Transportation'].map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>
            <TextField fullWidth label="Price" type="number" required sx={{ mb: 3 }} value={formData.price} 
              onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" variant="contained">Save</Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Container>
  );
};

export default Services;