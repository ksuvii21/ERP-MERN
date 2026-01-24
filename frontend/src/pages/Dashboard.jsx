import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Button, AppBar, Toolbar } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();

  // Sample data for the chart
  const data = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 2000 },
    { name: 'Apr', sales: 2780 },
    { name: 'May', sales: 1890 },
    { name: 'Jun', sales: 2390 },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ERP System
          </Typography>
          <Button color="inherit" onClick={() => navigate('/login')}>
            Login
          </Button>
          <Button color="inherit" onClick={() => navigate('/register')}>
            Register
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Public Dashboard Overview
        </Typography>
        <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Sales</Typography>
              <Typography variant="h4">$12,345</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Orders</Typography>
              <Typography variant="h4">123</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Sales Overview</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Quick Actions</Typography>
              <Button variant="contained" fullWidth sx={{ mb: 1 }}>Add Product</Button>
              <Button variant="outlined" fullWidth sx={{ mb: 1 }}>View Orders</Button>
              <Button variant="outlined" fullWidth>Generate Report</Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Recent Activity</Typography>
              <Typography variant="body2">New order received</Typography>
              <Typography variant="body2">Product updated</Typography>
              <Typography variant="body2">Invoice generated</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Inventory Status</Typography>
              <Typography variant="body2">Low stock: 5 items</Typography>
              <Typography variant="body2">Out of stock: 2 items</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
