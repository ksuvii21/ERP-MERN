import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, Tabs, Tab, Button, Switch, FormControlLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, MenuItem, Chip, Checkbox, FormGroup, Divider } from '@mui/material';
import { Assessment, AutoMode, Download, Add, Summarize, TableChart, PictureAsPdf, GridOn } from '@mui/icons-material';
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

  // Report Builder State
  const [builderConfig, setBuilderConfig] = useState({
    module: 'Sales',
    startDate: '2026-02-01',
    endDate: '2026-02-28',
    selectedColumns: ['Date', 'Invoice No', 'Customer', 'Amount', 'Status']
  });

  const availableColumns = {
    Sales: ['Date', 'Invoice No', 'Customer', 'Amount', 'Tax', 'Status', 'Salesperson'],
    Inventory: ['Product Name', 'SKU', 'Category', 'Stock Level', 'Unit Price', 'Total Value', 'Location'],
    Outstanding: ['Customer Name', 'Pending Amount', 'Due Date', 'Days Overdue', 'Last Payment Date']
  };

  const [reportData, setReportData] = useState([]);

  const handleColumnToggle = (col) => {
    setBuilderConfig(prev => ({
        ...prev,
        selectedColumns: prev.selectedColumns.includes(col) 
            ? prev.selectedColumns.filter(c => c !== col)
            : [...prev.selectedColumns, col]
    }));
  };

  const handleGenerate = () => {
    // Simulate API Call based on builderConfig
    const mockData = [
        { Date: '2026-02-01', 'Invoice No': 'INV-1001', Customer: 'Acme Corp', Amount: 1200, Status: 'Paid', 'Product Name': 'Laptop', 'Stock Level': 50 },
        { Date: '2026-02-05', 'Invoice No': 'INV-1002', Customer: 'Globex Inc', Amount: 3400, Status: 'Pending', 'Product Name': 'Mouse', 'Stock Level': 200 },
        { Date: '2026-02-10', 'Invoice No': 'INV-1003', Customer: 'Stark Ind', Amount: 8500, Status: 'Overdue', 'Product Name': 'Monitor', 'Stock Level': 15 },
    ];
    setReportData(mockData);
  };

  const handleExport = (format) => {
    alert(`Exporting ${builderConfig.module} report as ${format}...`);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>Reports, MIS & Automation</Typography>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} variant="fullWidth">
          <Tab icon={<Assessment />} label="MIS Dashboard" />
          <Tab icon={<TableChart />} label="Dynamic Report Builder" />
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
          <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
            <Summarize /> Dynamic Report Builder
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} md={3}>
              <TextField select fullWidth label="Select Module" value={builderConfig.module} onChange={(e) => setBuilderConfig({...builderConfig, module: e.target.value})}>
                <MenuItem value="Sales">Sales Analysis</MenuItem>
                <MenuItem value="Inventory">Stock Reports</MenuItem>
                <MenuItem value="Outstanding">Outstanding Reports</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField type="date" fullWidth label="Start Date" InputLabelProps={{ shrink: true }} value={builderConfig.startDate} onChange={(e) => setBuilderConfig({...builderConfig, startDate: e.target.value})} />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField type="date" fullWidth label="End Date" InputLabelProps={{ shrink: true }} value={builderConfig.endDate} onChange={(e) => setBuilderConfig({...builderConfig, endDate: e.target.value})} />
            </Grid>
            <Grid item xs={12} md={3}>
              <Button variant="contained" fullWidth size="large" startIcon={<GridOn />} onClick={handleGenerate}>Generate Report</Button>
            </Grid>
          </Grid>

          <Box mb={3} p={2} bgcolor="#f8fafc" borderRadius={2} border="1px solid #e2e8f0">
            <Typography variant="subtitle2" gutterBottom>Select Columns:</Typography>
            <FormGroup row>
                {availableColumns[builderConfig.module].map(col => (
                    <FormControlLabel 
                        key={col}
                        control={<Checkbox checked={builderConfig.selectedColumns.includes(col)} onChange={() => handleColumnToggle(col)} size="small" />}
                        label={col}
                    />
                ))}
            </FormGroup>
          </Box>
          
          {reportData.length > 0 && (
            <>
                <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
                    <Button variant="outlined" startIcon={<TableChart />} onClick={() => handleExport('CSV')}>Export CSV</Button>
                    <Button variant="outlined" color="error" startIcon={<PictureAsPdf />} onClick={() => handleExport('PDF')}>Export PDF</Button>
                </Box>
                <TableContainer sx={{ border: '1px solid #e2e8f0', borderRadius: 2, maxHeight: 400 }}>
                    <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                        {builderConfig.selectedColumns.map(col => (
                            <TableCell key={col} sx={{ bgcolor: '#f1f5f9', fontWeight: 'bold' }}>{col}</TableCell>
                        ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reportData.map((row, idx) => (
                        <TableRow key={idx} hover>
                            {builderConfig.selectedColumns.map(col => (
                                <TableCell key={col}>{row[col] !== undefined ? row[col] : '-'}</TableCell>
                            ))}
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </TableContainer>
            </>
          )}
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