import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Paper, Button, AppBar, Toolbar, Container } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Inventory, PointOfSale, ShowChart } from '@mui/icons-material';

const Home = () => {
  const navigate = useNavigate();

  // Sample data for the chart
  const data = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 4780 },
    { name: 'May', sales: 5890 },
    { name: 'Jun', sales: 5390 },
  ];

  const features = [
    {
      icon: <Inventory color="primary" sx={{ fontSize: 40 }} />,
      title: 'Inventory Management',
      description: 'Track stock levels, manage variants, and automate reordering with our powerful inventory tools.',
    },
    {
      icon: <PointOfSale color="primary" sx={{ fontSize: 40 }} />,
      title: 'Sales & CRM',
      description: 'Manage customer relationships, create sales orders, and track your sales pipeline from lead to close.',
    },
    {
      icon: <ShowChart color="primary" sx={{ fontSize: 40 }} />,
      title: 'Insightful Analytics',
      description: 'Gain a competitive edge with real-time dashboards, sales forecasting, and customizable reports.',
    },
  ];

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: '#f4f6f8' }}>
      <AppBar position="sticky" sx={{ backgroundColor: 'white', color: 'black' }}>
        <Toolbar>
          <TrendingUp sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Nexus ERP
          </Typography>
          <Button variant="outlined" sx={{ mr: 2 }} onClick={() => navigate('/login')}>
            Login
          </Button>
          <Button variant="contained" onClick={() => navigate('/register')}>
            Register
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', py: 10, px: 2, backgroundColor: 'white' }}>
        <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
          The All-in-One ERP for Growing Businesses
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: '700px', mx: 'auto' }}>
          Streamline your operations, from inventory and sales to analytics, all from a single, powerful platform.
        </Typography>
        <Button variant="contained" size="large" onClick={() => navigate('/register')}>
          Get Started for Free
        </Button>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Main Content */}
        <Grid container spacing={4}>
          {/* Sales Overview Chart */}
          <Grid size={{ xs: 12 }}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h5" fontWeight="600" gutterBottom>
                Sales Growth Overview
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" padding={{ left: 10, right: 10 }} />
                  <YAxis />
                  <Tooltip wrapperStyle={{ borderColor: 'white', boxShadow: '2px 2px 10px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="sales" fill="#1976d2" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box component="footer" sx={{ backgroundColor: 'white', p: 4, mt: 6, textAlign: 'center' }}>
        <Typography variant="body1">&copy; {new Date().getFullYear()} Nexus ERP. All rights reserved.</Typography>
      </Box>
    </Box>
  );
};

export default Home;