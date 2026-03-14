import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Modal, Box, TextField, MenuItem, Chip } from '@mui/material';
import { Add } from '@mui/icons-material';
import api from '../../utils/api';

const Equipment = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', type: '', serialNumber: '', status: 'Available' });

  const fetchEquipment = async () => {
    try {
      const res = await api.get('construction/equipment');
      setEquipment(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchEquipment(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('construction/equipment', formData);
      setOpen(false);
      fetchEquipment();
    } catch (err) { alert('Error saving equipment'); }
  };

  if (loading) return <CircularProgress />;

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" mb={4}>
        <Typography variant="h4">Equipment Fleet</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>Add Equipment</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Serial Number</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {equipment.map((e) => (
              <TableRow key={e._id}>
                <TableCell>{e.name}</TableCell>
                <TableCell>{e.type}</TableCell>
                <TableCell>{e.serialNumber}</TableCell>
                <TableCell>
                  <Chip label={e.status} color={e.status === 'Available' ? 'success' : 'warning'} size="small" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'white', p: 4, borderRadius: 2 }}>
          <Typography variant="h6" mb={2}>Register Equipment</Typography>
          <form onSubmit={handleSubmit}>
            <TextField label="Equipment Name" fullWidth sx={{ mb: 2 }} required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            <TextField label="Type" fullWidth sx={{ mb: 2 }} required value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} />
            <TextField label="Serial Number" fullWidth sx={{ mb: 2 }} value={formData.serialNumber} onChange={(e) => setFormData({...formData, serialNumber: e.target.value})} />
            <TextField select label="Status" fullWidth sx={{ mb: 2 }} value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
              {['Available', 'In Use', 'Maintenance'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
            <Button type="submit" variant="contained" fullWidth>Add to Fleet</Button>
          </form>
        </Box>
      </Modal>
    </Container>
  );
};
export default Equipment;