import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, InputAdornment,
  Chip, CircularProgress, Avatar
} from '@mui/material';
import { Search, History, Person, Security } from '@mui/icons-material';
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

    // Debounce search to prevent too many API calls
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
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Security fontSize="large" color="primary" /> System Audit Logs
        </Typography>
        <Typography color="textSecondary">
          Track user activities and security events across the system.
        </Typography>
      </Box>

      <Paper sx={{ p: 2, mb: 3, borderRadius: '12px', display: 'flex', alignItems: 'center' }}>
        <TextField
          fullWidth
          placeholder="Search logs by user, action, or entity ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
        />
      </Paper>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>USER</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>ACTION</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>ENTITY</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>TIMESTAMP</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                  No logs found.
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log._id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <Avatar sx={{ width: 30, height: 30, fontSize: '0.8rem' }}>{log.userName?.[0]}</Avatar>
                      <Typography variant="body2" fontWeight={500}>{log.userName}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={log.action.replace(/_/g, ' ')} 
                      color={getActionColor(log.action)} 
                      size="small" 
                      variant="outlined"
                      sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {log.entity}: <span style={{ fontFamily: 'monospace' }}>{log.entityId}</span>
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1} color="text.secondary">
                      <History fontSize="small" />
                      <Typography variant="body2">
                        {new Date(log.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default SystemLogs;
