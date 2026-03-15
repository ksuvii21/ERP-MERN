import React, { useState, useEffect } from 'react';
import { 
  Box, Grid, Paper, Typography, Card, CardContent, Divider, 
  List, ListItem, ListItemText, ListItemAvatar, Avatar, Chip, IconButton
} from '@mui/material';
import { 
  TrendingUp, Users, Server, AlertTriangle, MoreVertical, CheckCircle 
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import API from '../../utils/api';

const KPICard = ({ title, value, trend, icon: Icon, color }) => (
  <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="start">
        <Box>
          <Typography variant="subtitle2" color="textSecondary" fontWeight={600}>{title}</Typography>
          <Typography variant="h4" fontWeight={700} sx={{ my: 1 }}>{value}</Typography>
          {trend && (
            <Chip 
              label={trend} 
              size="small" 
              color={trend.includes('+') ? 'success' : 'error'} 
              sx={{ height: 20, fontSize: '0.75rem' }} 
            />
          )}
        </Box>
        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: `${color}.50`, color: `${color}.main` }}>
          <Icon size={24} />
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, revenue: 0, alerts: 0, serverHealth: '98%' });

  // Mock Data mimicking an ERP DB response
  const revenueData = [
    { name: 'Mon', uv: 4000 }, { name: 'Tue', uv: 3000 },
    { name: 'Wed', uv: 2000 }, { name: 'Thu', uv: 2780 },
    { name: 'Fri', uv: 1890 }, { name: 'Sat', uv: 2390 }, { name: 'Sun', uv: 3490 },
  ];
  
  const storageData = [
    { name: 'Used', value: 75 }, { name: 'Free', value: 25 }
  ];
  const COLORS = ['#3b82f6', '#e2e8f0'];

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
        // In real scenario: const res = await API.get('/admin/stats');
        setStats({ users: 142, revenue: 125000, alerts: 3, serverHealth: 'Good' });
    };
    fetchData();
  }, []);

  return (
    <Box sx={{ flexGrow: 1, p: 3, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={700} color="#1e293b">System Overview</Typography>
        <Typography variant="body2" color="textSecondary">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Typography>
      </Box>

      {/* KPI Row */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard title="Total Users" value={stats.users} trend="+12% this week" icon={Users} color="primary" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard title="Revenue (MTD)" value={`$${(stats.revenue/1000).toFixed(1)}k`} trend="+5.4%" icon={TrendingUp} color="success" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard title="System Alerts" value={stats.alerts} trend="Needs Action" icon={AlertTriangle} color="warning" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard title="Server Health" value={stats.serverHealth} icon={Server} color="info" />
        </Grid>
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Revenue Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 400, borderRadius: 2, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)' }}>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="h6" fontWeight={600}>Revenue Analytics</Typography>
              <IconButton size="small"><MoreVertical /></IconButton>
            </Box>
            <ResponsiveContainer width="100%" height="90%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="uv" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorUv)" />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* System Health / Storage */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400, borderRadius: 2, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)' }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Storage Usage</Typography>
            <Box height={250} position="relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={storageData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {storageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <Box position="absolute" top="50%" left="50%" sx={{ transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <Typography variant="h4" fontWeight={700}>75%</Typography>
                <Typography variant="caption" color="textSecondary">Used</Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Database</Typography>
                <Typography variant="body2" fontWeight="bold">12.4 GB / 20 GB</Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Recent Audit Log */}
        <Grid item xs={12}>
            <Paper sx={{ borderRadius: 2 }}>
                <Box p={2} borderBottom="1px solid #f1f5f9"><Typography variant="h6" fontWeight={600}>System Audit Logs</Typography></Box>
                {/* A table would go here, omitting for brevity */}
                <Box p={3} textAlign="center" color="text.secondary">Viewing logs requires advanced permissions.</Box>
            </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;