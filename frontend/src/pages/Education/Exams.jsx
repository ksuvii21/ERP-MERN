import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Box } from '@mui/material';
import api from '../../utils/api';

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await api.get('education/exams');
        setExams(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchExams();
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <Container>
      <Typography variant="h4" fontWeight="bold" mb={4}>Examination Schedule</Typography>
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
    </Container>
  );
};
export default Exams;