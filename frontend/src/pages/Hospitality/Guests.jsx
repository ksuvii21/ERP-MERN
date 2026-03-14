import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Button, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, CircularProgress, Box, Modal, TextField 
} from '@mui/material';
import { Add } from '@mui/icons-material';
import api from '../../utils/api';

const Guests = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', idProof: '' });

  const fetchGuests = async () => {
    try {
      setLoading(true);
      const res = await api.get('hospitality/guests');
      setGuests(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchGuests(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('hospitality/guests', formData);
      setOpen(false);
      setFormData({ name: '', email: '', phone: '', idProof: '' });
      fetchGuests();
    } catch (err) { alert('Error registering guest'); }
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">Guest Directory</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>Register Guest</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>ID Proof</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {guests.map((g) => (
              <TableRow key={g._id} hover>
                <TableCell sx={{ fontWeight: 'medium' }}>{g.name}</TableCell>
                <TableCell>{g.email}</TableCell>
                <TableCell>{g.phone}</TableCell>
                <TableCell>{g.idProof}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'white', p: 4, borderRadius: 2 }}>
          <Typography variant="h6" mb={2}>Register New Guest</Typography>
          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="Guest Name" required sx={{ mb: 2 }} value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <TextField fullWidth label="Email" type="email" required sx={{ mb: 2 }} value={formData.email} 
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            <TextField fullWidth label="Phone Number" required sx={{ mb: 2 }} value={formData.phone} 
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            <TextField fullWidth label="ID Proof (Passport/SSN)" sx={{ mb: 3 }} value={formData.idProof} 
              onChange={(e) => setFormData({ ...formData, idProof: e.target.value })} />
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" variant="contained">Register</Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Container>
  );
};

export default Guests;