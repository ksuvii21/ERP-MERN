import React from 'react';
import { Grid, Box, Typography, Paper } from '@mui/material';
import { AttachMoney, MoneyOff, AccountBalanceWallet, Receipt } from '@mui/icons-material';
import KPICard from '../components/KPICard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', revenue: 4000, expenses: 2400 },
  { name: 'Feb', revenue: 3000, expenses: 1398 },
  { name: 'Mar', revenue: 2000, expenses: 9800 },
  { name: 'Apr', revenue: 2780, expenses: 3908 },
  { name: 'May', revenue: 1890, expenses: 4800 },
  { name: 'Jun', revenue: 2390, expenses: 3800 },
];

const FinanceDashboard = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1e293b' }}>
        Financial Overview
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard title="Total Revenue" value="$128,400" icon={<AttachMoney />} trend={8.2} color="#10b981" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard title="Total Expenses" value="$45,200" icon={<MoneyOff />} trend={-2.4} color="#ef4444" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard title="Net Profit" value="$83,200" icon={<AccountBalanceWallet />} trend={12} color="#3b82f6" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard title="Pending Invoices" value="14" icon={<Receipt />} color="#f59e0b" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Revenue vs Expenses</Typography>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="expenses" stroke="#ef4444" fillOpacity={0.3} fill="#ef4444" />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FinanceDashboard;