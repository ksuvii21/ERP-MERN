import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box, CircularProgress } from '@mui/material';
import API from '../utils/api';
import ChartCard from '../components/ChartCard';
import AlertsCard from '../components/AlertsCard';

const StatCard = ({ title, value, color }) => (
  <Paper
    sx={{
      p: 3,
      display: 'flex',
      flexDirection: 'column',
      height: 140,
      justifyContent: 'center',
      bgcolor: color,
      color: 'white',
    }}
  >
    <Typography component="h2" variant="h6" gutterBottom>
      {title}
    </Typography>
    <Typography component="p" variant="h3">
      {value}
    </Typography>
  </Paper>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    sales: 0,
    products: 0,
    users: 0,
    purchases: 0,
  });
  const [loading, setLoading] = useState(true);
  
  // Mock alerts for Admin
  const systemAlerts = [
    { message: 'High server load detected (92%).', type: 'error' },
    { message: '3 failed login attempts from unknown IP.', type: 'warning' },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch data from your existing API endpoints
        const [salesRes, productsRes, usersRes, purchasesRes] = await Promise.all([
          API.get('/sales'),
          API.get('/products'),
          API.get('/users'),
          API.get('/purchases'),
        ]);

        setStats({
          sales: salesRes.data.length,
          products: productsRes.data.length,
          users: usersRes.data.length,
          purchases: purchasesRes.data.length,
        });
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <StatCard title="Total Sales" value={stats.sales} color="#1976d2" />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard title="Products" value={stats.products} color="#2e7d32" />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard title="Purchases" value={stats.purchases} color="#ed6c02" />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard title="Users" value={stats.users} color="#9c27b0" />
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>Analytics & System Health</Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', margin: '0 -10px' }}>
          <ChartCard title="Revenue Trends (2024)" />
          <AlertsCard title="System Alerts" alerts={systemAlerts} />
        </div>
      </Box>
    </Box>
  );
};

export default AdminDashboard;