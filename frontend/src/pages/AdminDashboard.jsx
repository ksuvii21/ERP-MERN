import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box, CircularProgress } from '@mui/material';
import API from '../utils/api';

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
  const [error, setError] = useState(null);

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
        setError('Failed to connect to the server. Please ensure the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>
          Connection Error
        </Typography>
        <Typography variant="body1">
          {error}
        </Typography>
      </Box>
    );
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
    </Box>
  );
};

export default AdminDashboard;