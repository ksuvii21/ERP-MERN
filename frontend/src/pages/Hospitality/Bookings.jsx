import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Button, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, CircularProgress, Box, Modal, TextField, MenuItem, Chip 
} from '@mui/material';
import { Add } from '@mui/icons-material';
import api from '../../utils/api';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [guests, setGuests] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ guest: '', room: '', checkIn: '', checkOut: '', status: 'Confirmed' });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bookRes, guestRes, roomRes] = await Promise.all([
        api.get('hospitality/bookings'),
        api.get('hospitality/guests'),
        api.get('hospitality/rooms')
      ]);
      setBookings(bookRes.data);
      setGuests(guestRes.data);
      setRooms(roomRes.data.filter(r => r.status === 'Available'));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('hospitality/bookings', formData);
      setOpen(false);
      setFormData({ guest: '', room: '', checkIn: '', checkOut: '', status: 'Confirmed' });
      fetchData();
    } catch (err) { alert('Error creating booking'); }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await api.patch(`hospitality/bookings/${id}/status`, { status: newStatus });
      fetchData();
    } catch (err) { console.error(err); }
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">Room Bookings</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>New Booking</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell>Guest</TableCell>
              <TableCell>Room</TableCell>
              <TableCell>Check-In</TableCell>
              <TableCell>Check-Out</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((b) => (
              <TableRow key={b._id} hover>
                <TableCell>{b.guest?.name}</TableCell>
                <TableCell>{b.room?.roomNumber} ({b.room?.type})</TableCell>
                <TableCell>{new Date(b.checkIn).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(b.checkOut).toLocaleDateString()}</TableCell>
                <TableCell><Chip label={b.status} size="small" /></TableCell>
                <TableCell>
                  {b.status === 'Confirmed' && <Button size="small" onClick={() => updateStatus(b._id, 'Checked In')}>Check-In</Button>}
                  {b.status === 'Checked In' && <Button size="small" color="error" onClick={() => updateStatus(b._id, 'Checked Out')}>Check-Out</Button>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 450, bgcolor: 'white', p: 4, borderRadius: 2 }}>
          <Typography variant="h6" mb={2}>New Booking Entry</Typography>
          <form onSubmit={handleSubmit}>
            <TextField select fullWidth label="Guest" required sx={{ mb: 2 }} value={formData.guest} 
              onChange={(e) => setFormData({ ...formData, guest: e.target.value })}>
              {guests.map(g => <MenuItem key={g._id} value={g._id}>{g.name}</MenuItem>)}
            </TextField>
            <TextField select fullWidth label="Available Room" required sx={{ mb: 2 }} value={formData.room} 
              onChange={(e) => setFormData({ ...formData, room: e.target.value })}>
              {rooms.map(r => <MenuItem key={r._id} value={r._id}>{r.roomNumber} - {r.type} (${r.price})</MenuItem>)}
            </TextField>
            <TextField fullWidth label="Check-In Date" type="date" required sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} value={formData.checkIn} 
              onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })} />
            <TextField fullWidth label="Check-Out Date" type="date" required sx={{ mb: 3 }} InputLabelProps={{ shrink: true }} value={formData.checkOut} 
              onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })} />
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" variant="contained">Confirm Booking</Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Container>
  );
};

export default Bookings;