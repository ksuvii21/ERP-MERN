import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import { SupervisorAccount, Business, AttachMoney, Settings } from '@mui/icons-material';
import KPICard from '../components/KPICard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', users: 400 },
  { name: 'Feb', users: 300 },
  { name: 'Mar', users: 500 },
  { name: 'Apr', users: 280 },
  { name: 'May', users: 590 },
];

const AdminDashboard = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1e293b' }}>
        Admin Overview
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard title="Total Users" value="1,250" icon={<SupervisorAccount />} trend={15} color="#3b82f6" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard title="Active Projects" value="45" icon={<Business />} trend={5} color="#10b981" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard title="System Health" value="98%" icon={<Settings />} trend={1} color="#8b5cf6" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard title="Revenue" value="$1.2M" icon={<AttachMoney />} trend={12} color="#f59e0b" />
        </Grid>
      </Grid>

      <Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 2, boxShadow: 1 }}>
        <Typography variant="h6" gutterBottom>User Growth</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="users" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default AdminDashboard;