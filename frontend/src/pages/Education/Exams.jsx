import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, CircularProgress, Box, Button, Modal, TextField, MenuItem 
} from '@mui/material';
import { Add } from '@mui/icons-material';
import api from '../../utils/api';

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', course: '', date: '', maxMarks: 100 });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [examRes, courseRes] = await Promise.all([
        api.get('education/exams'),
        api.get('education/courses')
      ]);
      setExams(examRes.data);
      setCourses(courseRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('education/exams', formData);
      setOpen(false);
      setFormData({ title: '', course: '', date: '', maxMarks: 100 });
      fetchData();
    } catch (err) { alert('Error scheduling exam'); }
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">Examination Schedule</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>Schedule Exam</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell>Exam Title</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {exams.map((e) => (
              <TableRow key={e._id}>
                <TableCell>{e.title}</TableCell>
                <TableCell>{e.course?.title}</TableCell>
                <TableCell>{new Date(e.date).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'white', p: 4, borderRadius: 2 }}>
          <Typography variant="h6" mb={2}>Schedule New Exam</Typography>
          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="Exam Title" required sx={{ mb: 2 }} value={formData.title} 
              onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            <TextField select fullWidth label="Select Course" required sx={{ mb: 2 }} value={formData.course} 
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}>
              {courses.map(c => <MenuItem key={c._id} value={c._id}>{c.title}</MenuItem>)}
            </TextField>
            <TextField fullWidth label="Exam Date" type="date" required sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} value={formData.date} 
              onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
            <TextField fullWidth label="Max Marks" type="number" required sx={{ mb: 3 }} value={formData.maxMarks} 
              onChange={(e) => setFormData({ ...formData, maxMarks: e.target.value })} />
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" variant="contained">Schedule</Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Container>
  );
};
export default Exams;