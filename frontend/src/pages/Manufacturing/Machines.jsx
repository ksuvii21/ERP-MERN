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
  Alert,
  Modal,
  Box,
  TextField,
  Chip,
  MenuItem,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import api from '../../utils/api';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '1px solid #ccc',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4,
};

const statusColors = {
  Running: 'success',
  Idle: 'primary',
  Maintenance: 'warning',
  Offline: 'error',
};

const Machines = () => {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  const [newMachine, setNewMachine] = useState({
    name: '',
    location: '',
    status: 'Idle',
  });

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        setLoading(true);
        const res = await api.get('/machines');
        setMachines(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch machines.');
      } finally {
        setLoading(false);
      }
    };
    fetchMachines();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setNewMachine({ ...newMachine, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/machines', newMachine);
      setMachines([...machines, res.data]);
      handleClose();
      setNewMachine({ name: '', location: '', status: 'Idle' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create machine.');
    }
  };

  if (loading) return <Container><CircularProgress /></Container>;

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">Machine Management</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>Add Machine</Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead><TableRow><TableCell>Name</TableCell><TableCell>Location</TableCell><TableCell>Status</TableCell><TableCell>Last Updated</TableCell></TableRow></TableHead>
          <TableBody>
            {machines.map((machine) => (
              <TableRow key={machine._id} hover>
                <TableCell>{machine.name}</TableCell>
                <TableCell>{machine.location}</TableCell>
                <TableCell><Chip label={machine.status} color={statusColors[machine.status]} size="small" /></TableCell>
                <TableCell>{new Date(machine.updatedAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" component="h2" mb={2}>Add New Machine</Typography>
          <form onSubmit={handleSubmit}>
            <TextField label="Machine Name" name="name" value={newMachine.name} onChange={handleChange} fullWidth required sx={{ mb: 2 }} />
            <TextField label="Location / Area" name="location" value={newMachine.location} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
            <TextField select label="Status" name="status" value={newMachine.status} onChange={handleChange} fullWidth required sx={{ mb: 2 }}>
              {['Idle', 'Running', 'Maintenance', 'Offline'].map((option) => (<MenuItem key={option} value={option}>{option}</MenuItem>))}
            </TextField>
            <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
              <Button onClick={handleClose} color="secondary">Cancel</Button>
              <Button type="submit" variant="contained">Save Machine</Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Container>
  );
};

export default Machines;