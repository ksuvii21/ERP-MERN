import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, CircularProgress, 
  Box, Modal, TextField 
} from '@mui/material';
import { Add } from '@mui/icons-material';
import api from '../../utils/api';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', rollNumber: '', grade: '', email: '' });

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get('education/students');
      setStudents(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('education/students', formData);
      setOpen(false);
      setFormData({ name: '', rollNumber: '', grade: '', email: '' });
      fetchStudents();
    } catch (err) { alert('Error saving student'); }
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">Students</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>Register Student</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Roll Number</TableCell>
              <TableCell>Grade/Class</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.length === 0 ? (
              <TableRow><TableCell colSpan={4} align="center">No students found.</TableCell></TableRow>
            ) : (
              students.map((s) => (
                <TableRow key={s._id} hover>
                  <TableCell sx={{ fontWeight: 'medium' }}>{s.name}</TableCell>
                  <TableCell>{s.rollNumber}</TableCell>
                  <TableCell>{s.grade}</TableCell>
                  <TableCell>{s.email}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'white', p: 4, borderRadius: 2 }}>
          <Typography variant="h6" mb={2}>New Student Entry</Typography>
          <form onSubmit={handleSubmit}>
            <TextField 
              fullWidth label="Full Name" required sx={{ mb: 2 }}
              value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} 
            />
            <TextField 
              fullWidth label="Roll Number" required sx={{ mb: 2 }}
              value={formData.rollNumber} onChange={(e) => setFormData({...formData, rollNumber: e.target.value})} 
            />
            <TextField 
              fullWidth label="Grade" required sx={{ mb: 2 }}
              value={formData.grade} onChange={(e) => setFormData({...formData, grade: e.target.value})} 
            />
            <TextField 
              fullWidth label="Email" type="email" sx={{ mb: 3 }}
              value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} 
            />
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

export default Students;