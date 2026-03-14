import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, CircularProgress,
  Alert, Modal, Box, TextField, Autocomplete, MenuItem
} from '@mui/material';
import { Add } from '@mui/icons-material';
import api from '../../utils/api';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newAppt, setNewAppt] = useState({ patient: null, doctor: null, date: '', status: 'Scheduled' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aptRes, patRes, docRes] = await Promise.all([
          api.get('appointments'), api.get('patients'), api.get('doctors')
        ]);
        setAppointments(aptRes.data);
        setPatients(patRes.data);
        setDoctors(docRes.data);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...newAppt, patient: newAppt.patient?._id, doctor: newAppt.doctor?._id };
      const res = await api.post('/appointments', payload);
      setAppointments([...appointments, { ...res.data, patient: newAppt.patient, doctor: newAppt.doctor }]);
      setOpen(false);
    } catch (err) { alert('Error scheduling appointment'); }
  };

  if (loading) return <CircularProgress />;

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">Appointments</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>Schedule New</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date & Time</TableCell>
              <TableCell>Patient</TableCell>
              <TableCell>Doctor</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((apt) => (
              <TableRow key={apt._id}>
                <TableCell>{new Date(apt.date).toLocaleString()}</TableCell>
                <TableCell>{apt.patient?.name}</TableCell>
                <TableCell>{apt.doctor?.name}</TableCell>
                <TableCell>{apt.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 450, bgcolor: 'white', p: 4, borderRadius: 2 }}>
          <Typography variant="h6" mb={2}>Schedule Appointment</Typography>
          <form onSubmit={handleSubmit}>
            <Autocomplete 
              options={patients} getOptionLabel={(o) => o.name}
              onChange={(e, v) => setNewAppt({...newAppt, patient: v})}
              renderInput={(p) => <TextField {...p} label="Select Patient" required sx={{mb:2}}/>} 
            />
            <Autocomplete 
              options={doctors} getOptionLabel={(o) => o.name}
              onChange={(e, v) => setNewAppt({...newAppt, doctor: v})}
              renderInput={(p) => <TextField {...p} label="Select Doctor" required sx={{mb:2}}/>} 
            />
            <TextField type="datetime-local" fullWidth required sx={{mb:2}} 
              InputLabelProps={{ shrink: true }} label="Appointment Time"
              value={newAppt.date} onChange={(e) => setNewAppt({...newAppt, date: e.target.value})} />
            <Box display="flex" justifyContent="flex-end" gap={1}>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" variant="contained">Schedule</Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Container>
  );
};
export default Appointments;