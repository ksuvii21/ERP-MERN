import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, CircularProgress, Chip, Box, Button, Modal, TextField, MenuItem 
} from '@mui/material';
import { Add } from '@mui/icons-material';
import api from '../../utils/api';

const Attendance = () => {
  const [records, setRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ student: '', date: new Date().toISOString().split('T')[0], status: 'Present' });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [attRes, stdRes] = await Promise.all([
        api.get('education/attendance'),
        api.get('education/students')
      ]);
      setRecords(attRes.data);
      setStudents(stdRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('education/attendance', formData);
      setOpen(false);
      fetchData();
    } catch (err) { alert('Error marking attendance'); }
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">Student Attendance</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>Mark Attendance</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Student Name</TableCell>
              <TableCell>Roll Number</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((r) => (
              <TableRow key={r._id}>
                <TableCell>{new Date(r.date).toLocaleDateString()}</TableCell>
                <TableCell>{r.student?.name}</TableCell>
                <TableCell>{r.student?.rollNumber}</TableCell>
                <TableCell><Chip label={r.status} size="small" color={r.status === 'Present' ? 'success' : 'error'} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'white', p: 4, borderRadius: 2 }}>
          <Typography variant="h6" mb={2}>Mark Student Attendance</Typography>
          <form onSubmit={handleSubmit}>
            <TextField select fullWidth label="Select Student" required sx={{ mb: 2 }} value={formData.student} 
              onChange={(e) => setFormData({ ...formData, student: e.target.value })}>
              {students.map(s => <MenuItem key={s._id} value={s._id}>{s.name} ({s.rollNumber})</MenuItem>)}
            </TextField>
            <TextField fullWidth label="Date" type="date" required sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} value={formData.date} 
              onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
            <TextField select fullWidth label="Status" sx={{ mb: 3 }} value={formData.status} 
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
              {['Present', 'Absent', 'Late'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" variant="contained">Save Record</Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Container>
  );
};
export default Attendance;