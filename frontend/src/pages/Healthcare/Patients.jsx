import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, CircularProgress,
  Alert, Modal, Box, TextField, MenuItem
} from '@mui/material';
import { Add } from '@mui/icons-material';
import api from '../../utils/api';

const style = {
  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
  width: 500, bgcolor: 'background.paper', borderRadius: '8px', boxShadow: 24, p: 4,
};

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({ name: '', age: '', gender: '', contact: '', email: '' });

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await api.get('patients');
        setPatients(res.data);
      } catch (err) {
        setError('Failed to fetch patients.');
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/patients', newPatient);
      setPatients([...patients, res.data]);
      setOpen(false);
      setNewPatient({ name: '', age: '', gender: '', contact: '', email: '' });
    } catch (err) {
      setError('Failed to add patient.');
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">Patient Management</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>Add Patient</Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((p) => (
              <TableRow key={p._id} hover>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.age}</TableCell>
                <TableCell>{p.gender}</TableCell>
                <TableCell>{p.contact}</TableCell>
                <TableCell>{p.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <Typography variant="h6" mb={2}>Register New Patient</Typography>
          <form onSubmit={handleSubmit}>
            <TextField label="Full Name" fullWidth required sx={{ mb: 2 }} 
              value={newPatient.name} onChange={(e) => setNewPatient({...newPatient, name: e.target.value})} />
            <Box display="flex" gap={2} mb={2}>
              <TextField label="Age" type="number" fullWidth required 
                value={newPatient.age} onChange={(e) => setNewPatient({...newPatient, age: e.target.value})} />
              <TextField select label="Gender" fullWidth required 
                value={newPatient.gender} onChange={(e) => setNewPatient({...newPatient, gender: e.target.value})}>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            </Box>
            <TextField label="Contact Number" fullWidth required sx={{ mb: 2 }} 
              value={newPatient.contact} onChange={(e) => setNewPatient({...newPatient, contact: e.target.value})} />
            <TextField label="Email" type="email" fullWidth required sx={{ mb: 2 }} 
              value={newPatient.email} onChange={(e) => setNewPatient({...newPatient, email: e.target.value})} />
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

export default Patients;