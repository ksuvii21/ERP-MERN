import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Grid, Paper, Typography, Box, CircularProgress, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Avatar
} from '@mui/material';
import api from '../../utils/api';
import ChartCard from '../../components/ChartCard';
import AlertsCard from '../../components/AlertsCard';
import KPICard from '../../components/KPICard';
import { AttachMoney, Inventory, ShoppingCart, People, PersonAdd, LocalHospital, EventAvailable, Assignment, Schedule, TrendingUp } from '@mui/icons-material';
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
    pendingTasks: 12, // Mock data
    inventoryStatus: 'Good' // Mock data
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

  // Mock Data for Attendance Chart
  const attendanceData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        label: 'Present',
        data: [42, 45, 44, 46, 43],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Absent',
        data: [3, 0, 1, 0, 2],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  // Mock Data for Tables
  const recentOrders = [
    { id: 'ORD-7782', customer: 'Acme Corp', amount: '$1,200.50', status: 'Completed', date: '2024-03-10' },
    { id: 'ORD-7783', customer: 'Global Tech', amount: '$850.00', status: 'Pending', date: '2024-03-11' },
    { id: 'ORD-7784', customer: 'Local Shop', amount: '$320.25', status: 'Shipped', date: '2024-03-11' },
  ];

  const recentActivities = [
    { user: 'Admin User', action: 'Updated inventory', time: '2 hours ago' },
    { user: 'John Doe', action: 'Created new invoice', time: '4 hours ago' },
    { user: 'Jane Smith', action: 'Registered new client', time: '1 day ago' },
  ];

  useEffect(() => {
    const fetchStats = async () => {
  try {
    const [usersRes, salesRes, productsRes, purchasesRes] = await Promise.all([
      api.get('/users'), // Common for all
      // Only fetch these if industry is Retail/Wholesale/General
      ['Retail', 'Wholesale', 'General Business'].includes(user?.company?.industryType) ? api.get('/sales') : Promise.resolve({ data: [] }),
      ['Retail', 'Wholesale', 'General Business'].includes(user?.company?.industryType) ? api.get('/products') : Promise.resolve({ data: [] }),
      ['Retail', 'Wholesale', 'General Business'].includes(user?.company?.industryType) ? api.get('/purchases') : Promise.resolve({ data: [] }),
      
      // Add Healthcare specific fetches here in the future
      // user?.company?.industryType === 'Healthcare' ? api.get('/patients') : Promise.resolve({ data: [] })
    ]);

        setStats({
          sales: salesRes.data?.length || 0,
          products: productsRes.data?.length || 0,
          users: usersRes.data.length,
          purchases: purchasesRes.data?.length || 0,
          pendingTasks: 8, // You can fetch this from an API later
          inventoryStatus: productsRes.data?.length > 0 ? 'Active' : 'Empty'
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
        <Grid item xs={12} md={3}>
          <KPICard title="Total Employees" value={stats.users} icon={<People />} color="linear-gradient(135deg, #9c27b0 0%, #6a1b9a 100%)" />
        </Grid>

        {/* Retail / Wholesale / General KPIs */}
        {(!user?.company?.industryType || ['Retail', 'Wholesale', 'General Business'].includes(user?.company?.industryType)) && (
        <>
        <Grid item xs={12} md={3}>
          <KPICard title="Monthly Sales" value={stats.sales} icon={<AttachMoney />} color="linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)" />
        </Grid>
        <Grid item xs={12} md={3}>
          <KPICard title="Pending Tasks" value={stats.pendingTasks} icon={<Assignment />} color="linear-gradient(135deg, #ed6c02 0%, #e65100 100%)" />
        </Grid>
        <Grid item xs={12} md={3}>
          <KPICard title="Inventory Status" value={stats.products} icon={<Inventory />} color="linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)" />
        </Grid>
        </>
        )}

        {/* Healthcare KPIs Example */}
        {user?.company?.industryType === 'Healthcare' && (
        <>
          <Grid item xs={12} md={3}>
            <KPICard title="Active Patients" value={124} icon={<LocalHospital />} color="linear-gradient(135deg, #e91e63 0%, #c2185b 100%)" />
          </Grid>
          <Grid item xs={12} md={3}>
            <KPICard title="Appointments" value={15} icon={<EventAvailable />} color="linear-gradient(135deg, #00bcd4 0%, #0097a7 100%)" />
          </Grid>
        </>
        )}
      </Grid>

      {/* Charts Section */}
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          {/* Only show Sales charts for relevant industries */}
          {(!user?.company?.industryType || ['Retail', 'Wholesale', 'General Business'].includes(user?.company?.industryType)) && (
          <>
          <Grid item xs={12} md={8}>
            <ChartCard title="Revenue Trends (2024)">
              <Bar options={{ responsive: true, maintainAspectRatio: false }} data={revenueData} />
            </ChartCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <ChartCard title="Employee Attendance">
              <Bar options={{ responsive: true, maintainAspectRatio: false }} data={attendanceData} />
            </ChartCard>
          </Grid>
          </>
          )}
        </Grid>
      </Box>

      {/* Tables Section */}
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          {/* Recent Orders Table */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Recent Orders
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell align="right">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentOrders.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.id}</TableCell>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.customer}</TableCell>
                        <TableCell>{row.amount}</TableCell>
                        <TableCell align="right">
                          <Chip 
                            label={row.status} 
                            size="small" 
                            color={row.status === 'Completed' ? 'success' : row.status === 'Pending' ? 'warning' : 'primary'} 
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button color="primary" href="#" onClick={(e) => e.preventDefault()}>
                  View more orders
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Recent Activities / Alerts */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Recent Activities
              </Typography>
              <Box sx={{ flexGrow: 1 }}>
                {recentActivities.map((activity, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2, pb: 2, borderBottom: index !== recentActivities.length - 1 ? '1px solid #eee' : 'none' }}>
                    <Avatar sx={{ bgcolor: 'teal', width: 32, height: 32, mr: 2, fontSize: '0.875rem' }}>
                      {activity.user.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">{activity.user}</Typography>
                      <Typography variant="body2" color="textSecondary">{activity.action}</Typography>
                      <Typography variant="caption" color="textSecondary">{activity.time}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      </>
      )}
    </Box>
  );
};

export default AdminDashboard;