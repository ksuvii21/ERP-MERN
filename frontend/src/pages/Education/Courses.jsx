import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, CircularProgress, Box, Button, Modal, TextField 
} from '@mui/material';
import { Add } from '@mui/icons-material';
import api from '../../utils/api';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', code: '', credits: '' });

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get('education/courses');
      setCourses(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('education/courses', formData);
      setOpen(false);
      setFormData({ title: '', code: '', credits: '' });
      fetchCourses();
    } catch (err) {
      alert('Error creating course');
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">Course Catalog</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>Create Course</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell>Course Title</TableCell>
              <TableCell>Course Code</TableCell>
              <TableCell>Credits</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((c) => (
              <TableRow key={c._id} hover>
                <TableCell sx={{ fontWeight: 'medium' }}>{c.title}</TableCell>
                <TableCell>{c.code}</TableCell>
                <TableCell>{c.credits}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'white', p: 4, borderRadius: 2 }}>
          <Typography variant="h6" mb={2}>New Course Details</Typography>
          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="Course Title" required sx={{ mb: 2 }} value={formData.title} 
              onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            <TextField fullWidth label="Course Code" required sx={{ mb: 2 }} value={formData.code} 
              onChange={(e) => setFormData({ ...formData, code: e.target.value })} />
            <TextField fullWidth label="Credits" type="number" required sx={{ mb: 3 }} value={formData.credits} 
              onChange={(e) => setFormData({ ...formData, credits: e.target.value })} />
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" variant="contained">Create</Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Container>
  );
};
export default Courses;