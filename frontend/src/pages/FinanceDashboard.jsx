import React, { useState } from 'react';
import { Box, Typography, Grid, Paper, Button, Chip, Divider, List, ListItem, ListItemText } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Warning, Psychology } from '@mui/icons-material';

const FinanceDashboard = () => {
  // Mock Data
  const [financialData] = useState([
    { month: 'Jan', income: 50000, expense: 35000, profit: 15000 },
    { month: 'Feb', income: 55000, expense: 38000, profit: 17000 },
    { month: 'Mar', income: 48000, expense: 34000, profit: 14000 },
    { month: 'Apr', income: 60000, expense: 40000, profit: 20000 },
  ]);

  const [anomalies] = useState([
    { id: 1, desc: 'Duplicate Payment to Vendor X', amount: '$1,200', date: '2026-02-10', severity: 'High' },
    { id: 2, desc: 'Unusual Spike in Travel Expense', amount: '$4,500', date: '2026-02-12', severity: 'Medium' },
  ]);

  const [aiSummary] = useState(
    "Based on current trends, Q1 profit is projected to grow by 12%. Expense anomalies detected in Travel category require review. Tax liability estimation for this quarter is $15,400."
  );

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom fontWeight="bold">Finance & Accounting</Typography>

      {/* AI Summary Section */}
      <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f0f9ff', borderLeft: '6px solid #0ea5e9' }}>
        <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
          <Psychology color="primary" /> AI Financial Insights
        </Typography>
        <Typography variant="body1">{aiSummary}</Typography>
      </Paper>

      <Grid container spacing={3}>
        {/* Profit & Loss Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>Profit & Loss Overview</Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#22c55e" name="Income" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#ef4444" name="Expense" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Expense Anomalies */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400, overflowY: 'auto' }}>
            <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
              <Warning color="error" /> Expense Anomalies
            </Typography>
            <List>
              {anomalies.map((item) => (
                <ListItem key={item.id} sx={{ borderBottom: '1px solid #f1f5f9', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Box display="flex" justifyContent="space-between" width="100%" mb={1}>
                    <Typography fontWeight="bold">{item.amount}</Typography>
                    <Chip label={item.severity} color={item.severity === 'High' ? 'error' : 'warning'} size="small" />
                  </Box>
                  <ListItemText primary={item.desc} secondary={item.date} />
                </ListItem>
              ))}
            </List>
            <Button variant="outlined" fullWidth sx={{ mt: 2 }}>Run Deep Scan</Button>
          </Paper>
        </Grid>

        {/* Tax Overview */}
        <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Tax Liability Estimation</Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography>Corporate Tax (21%)</Typography>
                    <Typography fontWeight="bold">$13,860</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography>VAT / Sales Tax</Typography>
                    <Typography fontWeight="bold">$4,200</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography fontWeight="bold">Total Estimated</Typography>
                    <Typography fontWeight="bold" color="error">$18,060</Typography>
                </Box>
            </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FinanceDashboard;