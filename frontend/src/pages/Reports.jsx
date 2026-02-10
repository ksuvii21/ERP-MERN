import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, Tabs, Tab, Button, Switch, FormControlLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, MenuItem, Chip } from '@mui/material';
import { Assessment, AutoMode, Download, Add, Summarize } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Reports = () => {
  const [tabValue, setTabValue] = useState(0);

  // Mock Data for MIS
  const misData = [
    { month: 'Jan', revenue: 4000, expenses: 2400, profit: 1600 },
    { month: 'Feb', revenue: 3000, expenses: 1398, profit: 1602 },
    { month: 'Mar', revenue: 2000, expenses: 9800, profit: -7800 },
    { month: 'Apr', revenue: 2780, expenses: 3908, profit: -1128 },
    { month: 'May', revenue: 1890, expenses: 4800, profit: -2910 },
    { month: 'Jun', revenue: 2390, expenses: 3800, profit: -1410 },
  ];

  // Mock Data for Automation Rules
  const [automations, setAutomations] = useState([
    { id: 1, name: 'Auto-Reorder Inventory', trigger: 'Stock < Min Level', action: 'Create PO', active: true },
    { id: 2, name: 'Weekly Sales Report', trigger: 'Every Monday 9AM', action: 'Email to Admin', active: true },
    { id: 3, name: 'Low Balance Alert', trigger: 'Cash < $1000', action: 'SMS Finance Mgr', active: false },
    { id: 4, name: 'Auto-Approve Leave', trigger: 'Duration <= 1 Day', action: 'Approve', active: true },
  ]);

  const toggleAutomation = (id) => {
    setAutomations(automations.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>Reports, MIS & Automation</Typography>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} variant="fullWidth">
          <Tab icon={<Assessment />} label="MIS Dashboard" />
          <Tab icon={<Summarize />} label="Custom Reports" />
          <Tab icon={<AutoMode />} label="Automation Center" />
        </Tabs>
      </Paper>

      {/* Tab 0: MIS Dashboard */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, height: 400 }}>
              <Typography variant="h6" gutterBottom>Financial Performance (MIS)</Typography>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={misData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="profit" fill="#10b981" name="Profit" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: 400 }}>
              <Typography variant="h6" gutterBottom>Key Insights</Typography>
              <Box mt={2} p={2} bgcolor="#f0f9ff" borderRadius={2}>
                <Typography variant="subtitle2" color="text.secondary">Revenue Growth</Typography>
                <Typography variant="h4" color="primary" fontWeight="bold">+12.5%</Typography>
                <Typography variant="caption">Compared to last quarter</Typography>
              </Box>
              <Box mt={2} p={2} bgcolor="#f0fdf4" borderRadius={2}>
                <Typography variant="subtitle2" color="text.secondary">Operational Efficiency</Typography>
                <Typography variant="h4" color="success.main" fontWeight="bold">94%</Typography>
                <Typography variant="caption">Tasks completed on time</Typography>
              </Box>
              <Box mt={3}>
                <Button variant="outlined" fullWidth startIcon={<Download />}>Download Executive Summary</Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Tab 1: Custom Reports */}
      {tabValue === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Generate Custom Report</Typography>
          <Grid container spacing={2} alignItems="center" mb={3}>
            <Grid item xs={12} md={3}>
              <TextField select fullWidth label="Report Type" defaultValue="Sales">
                <MenuItem value="Sales">Sales Summary</MenuItem>
                <MenuItem value="Inventory">Inventory Valuation</MenuItem>
                <MenuItem value="Payroll">Payroll Register</MenuItem>
                <MenuItem value="Tax">GST/Tax Report</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField type="date" fullWidth label="Start Date" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField type="date" fullWidth label="End Date" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} md={3}>
              <Button variant="contained" fullWidth size="large" startIcon={<Assessment />}>Generate</Button>
            </Grid>
          </Grid>
          
          <TableContainer sx={{ border: '1px solid #e2e8f0', borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Report Name</TableCell>
                  <TableCell>Generated By</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>2026-02-10</TableCell>
                  <TableCell>Q1 Sales Summary</TableCell>
                  <TableCell>Admin</TableCell>
                  <TableCell><Chip label="Ready" color="success" size="small" /></TableCell>
                  <TableCell><Button size="small" startIcon={<Download />}>Download</Button></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2026-02-08</TableCell>
                  <TableCell>Inventory Audit</TableCell>
                  <TableCell>Manager</TableCell>
                  <TableCell><Chip label="Ready" color="success" size="small" /></TableCell>
                  <TableCell><Button size="small" startIcon={<Download />}>Download</Button></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Tab 2: Automation Center */}
      {tabValue === 2 && (
        <Paper sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">Active Automation Rules</Typography>
            <Button variant="contained" startIcon={<Add />}>Create New Rule</Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell>Rule Name</TableCell>
                  <TableCell>Trigger Condition</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {automations.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell fontWeight="bold">{rule.name}</TableCell>
                    <TableCell>{rule.trigger}</TableCell>
                    <TableCell>{rule.action}</TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={<Switch checked={rule.active} onChange={() => toggleAutomation(rule.id)} color="primary" />}
                        label={rule.active ? "Active" : "Paused"}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
};

export default Reports;