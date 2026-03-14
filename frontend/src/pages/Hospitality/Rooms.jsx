import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Button, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, CircularProgress, Modal, Box, TextField, MenuItem, Chip 
} from '@mui/material';
import { Add } from '@mui/icons-material';
import api from '../../utils/api';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ roomNumber: '', type: '', price: '', status: 'Available' });

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await api.get('hospitality/rooms');
      setRooms(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRooms(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('hospitality/rooms', formData);
      setOpen(false);
      setFormData({ roomNumber: '', type: '', price: '', status: 'Available' });
      fetchRooms();
    } catch (err) { alert('Error adding room'); }
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">Room Management</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>Add Room</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell>Room Number</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Price / Night</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rooms.map((r) => (
              <TableRow key={r._id} hover>
                <TableCell sx={{ fontWeight: 'medium' }}>{r.roomNumber}</TableCell>
                <TableCell>{r.type}</TableCell>
                <TableCell>${r.price}</TableCell>
                <TableCell>
                  <Chip 
                    label={r.status} 
                    size="small" 
                    color={r.status === 'Available' ? 'success' : r.status === 'Occupied' ? 'primary' : 'warning'} 
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'white', p: 4, borderRadius: 2 }}>
          <Typography variant="h6" mb={2}>Add New Room</Typography>
          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="Room Number" required sx={{ mb: 2 }} value={formData.roomNumber} 
              onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })} />
            <TextField select fullWidth label="Room Type" required sx={{ mb: 2 }} value={formData.type} 
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
              {['Single', 'Double', 'Suite', 'Deluxe'].map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </TextField>
            <TextField fullWidth label="Price per Night" type="number" required sx={{ mb: 2 }} value={formData.price} 
              onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
            <TextField select fullWidth label="Initial Status" sx={{ mb: 3 }} value={formData.status} 
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
              {['Available', 'Maintenance'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
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

export default Rooms;