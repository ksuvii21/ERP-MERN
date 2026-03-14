import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, CircularProgress,
  Alert, Modal, Box, TextField
} from '@mui/material';
import { Add } from '@mui/icons-material';
import api from '../../utils/api';

const style = {
  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
  width: 450, bgcolor: 'background.paper', borderRadius: '8px', boxShadow: 24, p: 4,
};

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [newDoctor, setNewDoctor] = useState({ name: '', specialization: '', contact: '' });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get('doctors');
        setDoctors(res.data);
      } catch (err) {
        setError('Failed to load doctors list.');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/doctors', newDoctor);
      setDoctors([...doctors, res.data]);
      setOpen(false);
      setNewDoctor({ name: '', specialization: '', contact: '' });
    } catch (err) {
      setError('Error adding doctor.');
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">Medical Staff</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>Add Doctor</Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Doctor Name</TableCell>
              <TableCell>Specialization</TableCell>
              <TableCell>Contact</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {doctors.map((doc) => (
              <TableRow key={doc._id} hover>
                <TableCell>{doc.name}</TableCell>
                <TableCell>{doc.specialization}</TableCell>
                <TableCell>{doc.contact}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <Typography variant="h6" mb={2}>Add New Doctor</Typography>
          <form onSubmit={handleSubmit}>
            <TextField label="Name" fullWidth required sx={{ mb: 2 }} 
              value={newDoctor.name} onChange={(e) => setNewDoctor({...newDoctor, name: e.target.value})} />
            <TextField label="Specialization" fullWidth required sx={{ mb: 2 }} 
              value={newDoctor.specialization} onChange={(e) => setNewDoctor({...newDoctor, specialization: e.target.value})} />
            <TextField label="Contact" fullWidth required sx={{ mb: 2 }} 
              value={newDoctor.contact} onChange={(e) => setNewDoctor({...newDoctor, contact: e.target.value})} />
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" variant="contained">Add Staff</Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Container>
  );
};
export default Doctors;