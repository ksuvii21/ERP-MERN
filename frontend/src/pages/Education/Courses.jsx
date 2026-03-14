import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Box, Button } from '@mui/material';
import api from '../../utils/api';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('education/courses');
        setCourses(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchCourses();
  }, []);

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">Course Catalog</Typography>
        <Button variant="contained">Create Course</Button>
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
    </Container>
  );
};
export default Courses;