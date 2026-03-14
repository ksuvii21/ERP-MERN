import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Box, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import api from '../../utils/api';

const Workers = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const res = await api.get('construction/workers');
        setWorkers(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchWorkers();
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" mb={4}>
        <Typography variant="h4">Labor & Field Workers</Typography>
        <Button variant="contained" startIcon={<Add />}>Register Worker</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Worker Name</TableCell>
              <TableCell>Trade/Specialty</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Hourly Rate</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workers.map((w) => (
              <TableRow key={w._id}>
                <TableCell>{w.name}</TableCell>
                <TableCell>{w.trade}</TableCell>
                <TableCell>{w.contact}</TableCell>
                <TableCell>${w.hourlyRate}/hr</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};
export default Workers;