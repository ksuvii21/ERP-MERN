import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, InputAdornment,
  Chip, CircularProgress, Avatar, Pagination, Grid
} from '@mui/material';
import { Search, History } from '@mui/icons-material';
import { ShieldCheck } from 'lucide-react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import api from '../../utils/api';

const SystemLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        let url = `/audit-logs?page=${page}&search=${searchTerm}`;
        if (dateRange.startDate) {
          url += `&startDate=${dateRange.startDate.toISOString().split('T')[0]}`;
        }
        if (dateRange.endDate) {
          url += `&endDate=${dateRange.endDate.toISOString().split('T')[0]}`;
        }
        
        const { data } = await api.get(url);
        setLogs(data.logs);
        setTotalPages(data.totalPages);
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
  }, [searchTerm, page, dateRange]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };
  
  const getActionColor = (action) => {
    if (action.includes('DELETE')) return 'error';
    if (action.includes('CREATE')) return 'success';
    if (action.includes('UPDATE')) return 'warning';
    return 'default';
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <ShieldCheck size={40} color="#0ea5e9" />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>System Audit Logs</Typography>
            <Typography color="textSecondary">Track user activities and security events across the system.</Typography>
          </Box>
        </Box>

        <Paper sx={{ p: 2, mb: 3, borderRadius: '12px' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search logs by user, action, or entity..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <DatePicker
                label="Start Date"
                value={dateRange.startDate}
                onChange={(newValue) => {
                  setDateRange({ ...dateRange, startDate: newValue });
                  setPage(1);
                }}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <DatePicker
                label="End Date"
                value={dateRange.endDate}
                onChange={(newValue) => {
                  setDateRange({ ...dateRange, endDate: newValue });
                  setPage(1);
                }}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
          </Grid>
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
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            disabled={loading}
          />
        </Box>
      </Container>
    </LocalizationProvider>
  );
};

export default SystemLogs;