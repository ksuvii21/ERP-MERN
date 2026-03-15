import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, InputAdornment,
  Chip, CircularProgress, Avatar
} from '@mui/material';
import { Search, History } from '@mui/icons-material';
import { Security } from 'lucide-react';
import api from '../../utils/api';

const SystemLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/audit-logs?search=${searchTerm}`);
        setLogs(data);
      } catch (err) {
        console.error("Failed to fetch logs", err);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchLogs();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const getActionColor = (action) => {
    if (action.includes('DELETE')) return 'error';
    if (action.includes('CREATE')) return 'success';
    if (action.includes('UPDATE')) return 'warning';
    return 'default';
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Security size={40} color="#0ea5e9" />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>System Audit Logs</Typography>
          <Typography color="textSecondary">Track user activities and security events across the system.</Typography>
        </Box>
      </Box>

      <Paper sx={{ p: 2, mb: 3, borderRadius: '12px' }}>
        <TextField
          fullWidth
          placeholder="Search logs by user, action, or entity..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
          }}
        />
      </Paper>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell>USER</TableCell>
              <TableCell>ACTION</TableCell>
              <TableCell>ENTITY</TableCell>
              <TableCell>TIMESTAMP</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} align="center" sx={{ py: 5 }}><CircularProgress /></TableCell></TableRow>
            ) : logs.map((log) => (
              <TableRow key={log._id} hover>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Avatar sx={{ width: 30, height: 30, fontSize: '0.8rem' }}>{log.userName?.[0]}</Avatar>
                    <Typography variant="body2">{log.userName}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={log.action.replace(/_/g, ' ')}
                    color={getActionColor(log.action)}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="textSecondary">{log.entity}: <span style={{ fontFamily: 'monospace' }}>{log.entityId}</span></Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">{new Date(log.createdAt).toLocaleString()}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default SystemLogs;