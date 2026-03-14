import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, CircularProgress, Box, Button, Modal, TextField 
} from '@mui/material';
import { Add } from '@mui/icons-material';
import api from '../../utils/api';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '' });

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const res = await api.get('education/teachers');
      setTeachers(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTeachers(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('education/teachers', formData);
      setOpen(false);
      setFormData({ name: '', email: '', subject: '' });
      fetchTeachers();
    } catch (err) {
      alert('Error adding teacher');
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">Faculty Members</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>Add Teacher</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Specialization/Subject</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teachers.map((t) => (
              <TableRow key={t._id} hover>
                <TableCell sx={{ fontWeight: 'medium' }}>{t.name}</TableCell>
                <TableCell>{t.email}</TableCell>
                <TableCell>{t.subject}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'white', p: 4, borderRadius: 2 }}>
          <Typography variant="h6" mb={2}>Add New Teacher</Typography>
          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="Full Name" required sx={{ mb: 2 }} value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <TextField fullWidth label="Email" type="email" required sx={{ mb: 2 }} value={formData.email} 
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            <TextField fullWidth label="Subject/Specialization" required sx={{ mb: 3 }} value={formData.subject} 
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })} />
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
export default Teachers;