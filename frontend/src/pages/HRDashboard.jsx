import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography, Paper, List, ListItem, ListItemText, Chip } from '@mui/material';
import { People, EventBusy, TrendingDown, Work } from '@mui/icons-material';
import KPICard from '../components/KPICard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const HRDashboard = () => {
  // Mock Data for AI Features
  const [attritionRisk, setAttritionRisk] = useState([]);
  const [leaveAnomalies, setLeaveAnomalies] = useState([]);
  const [productivityData, setProductivityData] = useState([]);

  useEffect(() => {
    // Simulate AI Model Fetching
    setAttritionRisk([
      { id: 1, name: 'Sarah Jenkins', role: 'Senior Dev', risk: 85, reason: 'Stagnant Salary & High Overtime' },
      { id: 2, name: 'Mike Ross', role: 'Sales Lead', risk: 72, reason: 'Frequent Short Leaves' },
    ]);

    setLeaveAnomalies([
      { id: 1, name: 'John Doe', type: 'Sick Leave', pattern: 'Mondays/Fridays (80%)' },
    ]);

    setProductivityData([
      { month: 'Jan', score: 88 }, { month: 'Feb', score: 85 },
      { month: 'Mar', score: 92 }, { month: 'Apr', score: 90 },
      { month: 'May', score: 94 }, { month: 'Jun', score: 91 },
    ]);
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1e293b' }}>
        HR Command Center
      </Typography>
      
      {/* KPI Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 3 }}>
          <KPICard title="Total Employees" value="142" icon={<People />} color="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)" />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <KPICard title="On Leave Today" value="8" icon={<EventBusy />} color="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <KPICard title="Attrition Risk" value="High (3)" icon={<TrendingDown />} color="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <KPICard title="Open Positions" value="12" icon={<Work />} color="linear-gradient(135deg, #10b981 0%, #059669 100%)" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* AI Feature: Attrition Prediction */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              🤖 AI Attrition Prediction
            </Typography>
            <List>
              {attritionRisk.map((employee) => (
                <ListItem key={employee.id} sx={{ borderBottom: '1px solid #f1f5f9' }}>
                  <ListItemText 
                    primary={<Typography fontWeight="600">{employee.name} <span style={{ fontSize: '12px', color: '#64748b' }}>({employee.role})</span></Typography>}
                    secondary={`Risk Factor: ${employee.reason}`}
                  />
                  <Chip label={`${employee.risk}% Risk`} color="error" size="small" />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* AI Feature: Leave Abuse Detection */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              🚩 Leave Abuse Detection
            </Typography>
            <List>
              {leaveAnomalies.map((item) => (
                <ListItem key={item.id} sx={{ borderBottom: '1px solid #f1f5f9' }}>
                  <ListItemText 
                    primary={<Typography fontWeight="600">{item.name}</Typography>}
                    secondary={`Pattern: ${item.pattern}`}
                  />
                  <Chip label="Review Needed" color="warning" size="small" />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Productivity Trend Analysis */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>Organization Productivity Trends</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={productivityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={3} name="Productivity Index" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HRDashboard;