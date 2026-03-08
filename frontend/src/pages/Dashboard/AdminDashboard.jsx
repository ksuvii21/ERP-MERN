import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Paper, Typography, Box, CircularProgress, Button } from '@mui/material';
import api from '../../utils/api';
import ChartCard from '../../components/ChartCard';
import AlertsCard from '../../components/AlertsCard';
import KPICard from '../../components/KPICard';
import { AttachMoney, Inventory, ShoppingCart, People, PersonAdd, LocalHospital, EventAvailable } from '@mui/icons-material';
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
  const user = JSON.parse(localStorage.getItem('user'));
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
      api.get('/users'), // Common for all
      // Only fetch these if industry is Retail/Wholesale/General
      ['Retail', 'Wholesale', 'General Business'].includes(user?.company?.industry) ? api.get('/sales') : Promise.resolve({ data: [] }),
      ['Retail', 'Wholesale', 'General Business'].includes(user?.company?.industry) ? api.get('/products') : Promise.resolve({ data: [] }),
      ['Retail', 'Wholesale', 'General Business'].includes(user?.company?.industry) ? api.get('/purchases') : Promise.resolve({ data: [] }),
      
      // Add Healthcare specific fetches here in the future
      // user?.company?.industry === 'Healthcare' ? api.get('/patients') : Promise.resolve({ data: [] })
    ]);

        setStats({
          sales: salesRes.data?.length || 0,
          products: productsRes.data?.length || 0,
          users: usersRes.data.length,
          purchases: purchasesRes.data?.length || 0,
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
        {/* Common KPI for everyone */}
        <Grid size={{ xs: 12, md: 3 }}>
          <KPICard title="Total Users" value={stats.users} icon={<People />} color="linear-gradient(135deg, #9c27b0 0%, #6a1b9a 100%)" />
        </Grid>

        {/* Retail / Wholesale / General KPIs */}
        {(!user?.company?.industry || ['Retail', 'Wholesale', 'General Business'].includes(user?.company?.industry)) && (
        <>
        <Grid size={{ xs: 12, md: 3 }}>
          <KPICard title="Total Sales" value={stats.sales} icon={<AttachMoney />} color="linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)" />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <KPICard title="Products" value={stats.products} icon={<Inventory />} color="linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)" />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <KPICard title="Purchases" value={stats.purchases} icon={<ShoppingCart />} color="linear-gradient(135deg, #ed6c02 0%, #e65100 100%)" />
        </Grid>
        </>
        )}

        {/* Healthcare KPIs Example */}
        {user?.company?.industry === 'Healthcare' && (
        <>
          <Grid size={{ xs: 12, md: 3 }}>
            <KPICard title="Active Patients" value={124} icon={<LocalHospital />} color="linear-gradient(135deg, #e91e63 0%, #c2185b 100%)" />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <KPICard title="Appointments" value={15} icon={<EventAvailable />} color="linear-gradient(135deg, #00bcd4 0%, #0097a7 100%)" />
          </Grid>
        </>
        )}
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>Analytics & System Health</Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', margin: '0 -10px' }}>
          {/* Only show Sales charts for Retail */}
          {(!user?.company?.industry || ['Retail', 'Wholesale'].includes(user?.company?.industry)) && (
          <>
          <ChartCard title="Revenue Trends (2024)">
            <Bar options={{ responsive: true, maintainAspectRatio: false }} data={revenueData} />
          </ChartCard>
          <ChartCard title="Product Categories">
            <Pie options={{ responsive: true, maintainAspectRatio: false }} data={categoryData} />
          </ChartCard>
          </>
          )}
          <AlertsCard title="System Alerts" alerts={systemAlerts} />
        </div>
      </Box>
      </>
      )}
    </Box>
  );
};

export default AdminDashboard;