import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Box, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import api from '../../utils/api';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await api.get('education/teachers');
        setTeachers(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchTeachers();
  }, []);

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">Faculty Members</Typography>
        <Button variant="contained" startIcon={<Add />}>Add Teacher</Button>
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
    </Container>
  );
};
export default Teachers;