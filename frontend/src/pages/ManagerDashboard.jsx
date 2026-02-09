import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography, Paper, Button, Chip } from '@mui/material';
import { Speed, BarChart as BarChartIcon, AttachMoney, Warning } from '@mui/icons-material';
import KPICard from '../components/KPICard';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

const ManagerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulate Real API Fetch from ERP Backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      // In reality: await fetch('/api/v1/manager/dashboard')
      setTimeout(() => {
        setData({
          performance: [
            { name: 'Dev Team', output: 85, target: 90 },
            { name: 'Design', output: 95, target: 80 },
            { name: 'QA', output: 70, target: 85 },
            { name: 'Ops', output: 92, target: 90 },
          ],
          trends: [
            { week: 'W1', productivity: 65 },
            { week: 'W2', productivity: 78 },
            { week: 'W3', productivity: 72 },
            { week: 'W4', productivity: 89 },
          ],
          risks: [
            { id: 1, msg: 'Database Migration: High Risk of Delay', level: 'Critical' },
            { id: 2, msg: 'Frontend QA: 3 days behind', level: 'Warning' }
          ]
        });
        setLoading(false);
      }, 1000);
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Enterprise Data...</div>;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" color="#1e293b">Operations Overview</Typography>
        <Button variant="contained" color="primary">Download Report</Button>
      </Box>

      {/* KPI Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <KPICard title="Project Velocity" value="4.2 pts/d" icon={<Speed />} trend={12} color="#3b82f6" />
        </Grid>
        <Grid item xs={12} md={4}>
          <KPICard title="Resource Load" value="82%" icon={<BarChartIcon />} trend={-5} color="#8b5cf6" />
        </Grid>
        <Grid item xs={12} md={4}>
          <KPICard title="Budget Burn" value="$12,400" icon={<AttachMoney />} trend={8} color="#f59e0b" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        
        {/* Productivity Trends (Real Chart) */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Productivity Trends</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.trends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="productivity" stroke="#3b82f6" strokeWidth={3} dot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Deadline Risks (Enhanced List) */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Deadline Risks</Typography>
            {data.risks.map(risk => (
              <Box key={risk.id} sx={{ p: 2, mb: 2, borderRadius: 1, bgcolor: risk.level === 'Critical' ? '#fef2f2' : '#fffbeb', border: 1, borderColor: risk.level === 'Critical' ? '#fee2e2' : '#fef3c7' }}>
                <Chip label={risk.level} color={risk.level === 'Critical' ? 'error' : 'warning'} size="small" sx={{ mb: 1 }} />
                <Typography variant="body2" color="text.primary">{risk.msg}</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Team Performance (Real Bar Chart) */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Team Performance vs. Target</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.performance}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip cursor={{fill: '#f1f5f9'}} />
                <Legend />
                <Bar dataKey="output" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ManagerDashboard;