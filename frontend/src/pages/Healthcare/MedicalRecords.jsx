import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Box } from '@mui/material';
import api from '../../utils/api';

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await api.get('/records');
        setRecords(res.data);
      } catch (err) {
        console.error('Records fetch failed');
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <Container>
      <Typography variant="h4" mb={4}>Patient Medical Records</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Patient</TableCell>
              <TableCell>Diagnosis</TableCell>
              <TableCell>Prescription/Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">No medical records found.</TableCell>
              </TableRow>
            ) : (
              records.map((rec) => (
                <TableRow key={rec._id}>
                  <TableCell>{new Date(rec.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{rec.patient?.name}</TableCell>
                  <TableCell>{rec.diagnosis}</TableCell>
                  <TableCell>{rec.treatment}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};
export default MedicalRecords;