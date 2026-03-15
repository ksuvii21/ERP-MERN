import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  Box, Grid, Paper, Typography, Card, CardContent, 
  CircularProgress, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip 
} from '@mui/material';
import { 
  AttachMoney, People, ReceiptLong, TrendingDown 
} from '@mui/icons-material';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import API from '../../utils/api';

const StatCard = ({ title, value, icon, color, subtext }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="overline">
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            {value}
          </Typography>
        </Box>
        <Box 
          sx={{ 
            bgcolor: `${color}.light`, 
            color: `${color}.main`, 
            p: 1, 
            borderRadius: 2,
            display: 'flex' 
          }}
        >
          {icon}
        </Box>
      </Box>
      <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
        {subtext}
      </Typography>
    </CardContent>
  </Card>
);

const ManagerDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    revenue: 0,
    pending: 0,
    employees: 0,
    expenses: 0
  });
  const [invoices, setInvoices] = useState([]);

  // Mock Data for Charts (Replace with real historical aggregation later)
  const chartData = [
    { name: 'Jan', revenue: 4000, expense: 2400 },
    { name: 'Feb', revenue: 3000, expense: 1398 },
    { name: 'Mar', revenue: 2000, expense: 9800 },
    { name: 'Apr', revenue: 2780, expense: 3908 },
    { name: 'May', revenue: 1890, expense: 4800 },
    { name: 'Jun', revenue: 2390, expense: 3800 },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Fetch Invoices from Backend
        const { data: invData } = await API.get('billing/invoices');
        
        const totalRevenue = invData
          .filter(i => i.status === 'Paid')
          .reduce((sum, i) => sum + i.totalAmount, 0);
          
        const totalPending = invData
          .filter(i => i.status === 'Pending' || i.status === 'Overdue')
          .reduce((sum, i) => sum + i.totalAmount, 0);

        // --- Process Data for Charts (Real-time) ---
        // Group invoices by Month
        const monthlyData = invData.reduce((acc, curr) => {
          const date = new Date(curr.dueDate);
          const month = date.toLocaleString('default', { month: 'short' });
          
          if (!acc[month]) acc[month] = { name: month, revenue: 0, expense: 0 };
          
          if (curr.status === 'Paid') {
            acc[month].revenue += curr.totalAmount;
          }
          // Estimating expenses as 60% of pending/overhead for visualization
          acc[month].expense += (curr.totalAmount * 0.4); 
          
          return acc;
        }, {});

        // Sort months chronologically (simple version) and set state
        const monthsOrder = { 'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6, 'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12 };
        const sortedChartData = Object.values(monthlyData).sort((a, b) => monthsOrder[a.name] - monthsOrder[b.name]);
        setChartData(sortedChartData);

        // 2. Fetch Users count (if endpoint exists)
        let empCount = 0;
        try {
          const { data: usersData } = await API.get('users');
          empCount = usersData.length;
        } catch (e) {
          console.warn('Could not fetch user count, defaulting to 0');
        }

        setMetrics({
          revenue: totalRevenue,
          pending: totalPending,
          employees: empCount,
          expenses: totalRevenue * 0.45 // Mock expense calc for now
        });

        setInvoices(invData.slice(0, 5)); // Recent 5 invoices
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Box p={4} display="flex" justifyContent="center"><CircularProgress /></Box>;

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
        <Box mb={4}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>Manager Dashboard</Typography>
            <Typography variant="subtitle1" color="textSecondary">Welcome back, {user?.name || 'User'}</Typography>
        </Box>

        <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard title="Total Revenue" value={`$${metrics.revenue.toLocaleString()}`} icon={<AttachMoney />} color="success" subtext="Paid Invoices" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard title="Pending Invoices" value={`$${metrics.pending.toLocaleString()}`} icon={<ReceiptLong />} color="warning" subtext="Needs Attention" />
            </Grid>
             <Grid item xs={12} sm={6} md={3}>
                <StatCard title="Total Expenses" value={`$${metrics.expenses.toLocaleString()}`} icon={<TrendingDown />} color="error" subtext="Estimated" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard title="Active Employees" value={metrics.employees} icon={<People />} color="primary" subtext="Total Staff" />
            </Grid>
        </Grid>

        <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
                <Paper sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">Revenue vs Expenses</Typography>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="revenue" fill="#4caf50" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="expense" fill="#ef5350" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
                <Paper sx={{ p: 0, height: '100%', overflow: 'hidden' }}>
                    <Box p={2} borderBottom="1px solid #eee"><Typography variant="h6" fontWeight="bold">Recent Invoices</Typography></Box>
                    <TableContainer>
                        <Table size="small">
                            <TableHead><TableRow><TableCell>Client</TableCell><TableCell align="right">Amount</TableCell><TableCell align="right">Status</TableCell></TableRow></TableHead>
                            <TableBody>
                                {invoices.map((inv) => (
                                    <TableRow key={inv._id}>
                                        <TableCell>{inv.customerName}</TableCell>
                                        <TableCell align="right">${inv.totalAmount}</TableCell>
                                        <TableCell align="right"><Chip label={inv.status} size="small" color={inv.status === 'Paid' ? 'success' : 'warning'} variant="outlined" /></TableCell>
                                    </TableRow>
                                ))}
                                {invoices.length === 0 && <TableRow><TableCell colSpan={3} align="center">No recent invoices</TableCell></TableRow>}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Grid>
        </Grid>
    </Box>
  );
};

export default ManagerDashboard;