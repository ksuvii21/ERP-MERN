import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Paper, Typography, Box, CircularProgress, Button } from '@mui/material';
import api from '../../utils/api';
import ChartCard from '../../components/ChartCard';
import AlertsCard from '../../components/AlertsCard';
import KPICard from '../../components/KPICard';
import { AttachMoney, Inventory, ShoppingCart, People, PersonAdd } from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);


const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    sales: 0,
    products: 0,
    users: 0,
    purchases: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Mock alerts for Admin
  const systemAlerts = [
    { message: 'High server load detected (92%).', type: 'error' },
    { message: '3 failed login attempts from unknown IP.', type: 'warning' },
    { message: 'System maintenance scheduled for Sunday.', type: 'warning' },
  ];

  // Chart Data
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [12000, 19000, 3000, 5000, 2000, 3000],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Expenses',
        data: [2000, 3000, 2000, 3000, 1000, 2000],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const categoryData = {
    labels: ['Electronics', 'Furniture', 'Clothing', 'Accessories'],
    datasets: [
      {
        label: '# of Products',
        data: [12, 19, 3, 5],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
        ],
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    const fetchStats = async () => {
  try {
    const [usersRes, salesRes, productsRes, purchasesRes] = await Promise.all([
      api.get('/users'),
      api.get('/sales'),
      api.get('/products'),
      api.get('/purchases')
    ]);

        setStats({
          sales: salesRes.data.length,
          products: productsRes.data.length,
          users: usersRes.data.length,
          purchases: purchasesRes.data.length,
        });
      } catch (error) {
        console.error('Error fetching dashboard data', error);
        if (error.response && error.response.status === 401) {
          setError('Session expired. Please login again.');
        } else {
          setError('Failed to connect to the server. Please ensure the backend is running.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<PersonAdd />} 
          onClick={() => navigate('/app/users')}
        >
          Invite User
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
      ) : error ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            Connection Error
          </Typography>
          <Typography variant="body1">
            {error}
          </Typography>
        </Box>
      ) : (
      <>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 3 }}>
          <KPICard title="Total Sales" value={stats.sales} icon={<AttachMoney />} color="linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)" />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <KPICard title="Products" value={stats.products} icon={<Inventory />} color="linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)" />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <KPICard title="Purchases" value={stats.purchases} icon={<ShoppingCart />} color="linear-gradient(135deg, #ed6c02 0%, #e65100 100%)" />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <KPICard title="Users" value={stats.users} icon={<People />} color="linear-gradient(135deg, #9c27b0 0%, #6a1b9a 100%)" />
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>Analytics & System Health</Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', margin: '0 -10px' }}>
          <ChartCard title="Revenue Trends (2024)">
            <Bar options={{ responsive: true, maintainAspectRatio: false }} data={revenueData} />
          </ChartCard>
          <ChartCard title="Product Categories">
            <Pie options={{ responsive: true, maintainAspectRatio: false }} data={categoryData} />
          </ChartCard>
          <AlertsCard title="System Alerts" alerts={systemAlerts} />
        </div>
      </Box>
      </>
      )}
    </Box>
  );
};

export default AdminDashboard;