import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Chip } from '@mui/material';
import api from '../../utils/api';

const Attendance = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await api.get('education/attendance');
        setRecords(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchAttendance();
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <Container>
      <Typography variant="h4" fontWeight="bold" mb={4}>Student Attendance</Typography>
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
    </Container>
  );
};
export default Attendance;