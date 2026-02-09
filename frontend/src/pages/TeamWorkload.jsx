import React, { useState } from 'react';
import { Box, Typography, Button, Grid, Paper, Avatar, Alert } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { Balance, WarningAmber } from '@mui/icons-material';

const TeamWorkload = () => {
  const [teamData, setTeamData] = useState([
    { name: 'Alice', tasks: 12, capacity: 10, burnoutRisk: 'High' },
    { name: 'Bob', tasks: 4, capacity: 10, burnoutRisk: 'Low' },
    { name: 'Charlie', tasks: 8, capacity: 10, burnoutRisk: 'Medium' },
    { name: 'Diana', tasks: 11, capacity: 10, burnoutRisk: 'High' },
    { name: 'Evan', tasks: 3, capacity: 10, burnoutRisk: 'Low' },
  ]);

  const [optimized, setOptimized] = useState(false);

  // AI Feature: Auto-Balance Workload
  const handleAutoBalance = () => {
    // Simple algorithm to redistribute tasks closer to average
    const totalTasks = teamData.reduce((acc, curr) => acc + curr.tasks, 0);
    const avg = Math.floor(totalTasks / teamData.length);
    
    const balancedData = teamData.map(member => ({
      ...member,
      tasks: avg + (Math.random() > 0.5 ? 1 : 0), // Add slight variance
      burnoutRisk: 'Low' // Reset risk after balancing
    }));

    setTeamData(balancedData);
    setOptimized(true);
  };

  const getBarColor = (tasks, capacity) => {
    if (tasks > capacity) return '#ef4444'; // Red for overload
    if (tasks > capacity * 0.8) return '#f59e0b'; // Orange for warning
    return '#3b82f6'; // Blue for healthy
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">Team Workload & Burnout AI</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<Balance />}
          onClick={handleAutoBalance}
          disabled={optimized}
        >
          {optimized ? 'Workload Balanced' : 'Auto-Balance Workload'}
        </Button>
      </Box>

      {teamData.some(m => m.burnoutRisk === 'High') && !optimized && (
        <Alert severity="warning" icon={<WarningAmber />} sx={{ mb: 3 }}>
          <strong>AI Alert:</strong> High burnout risk detected for Alice and Diana. Recommended immediate task redistribution.
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>Current Task Distribution</Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <ReferenceLine y={10} label="Max Capacity" stroke="red" strokeDasharray="3 3" />
                <Bar dataKey="tasks" radius={[4, 4, 0, 0]}>
                  {teamData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.tasks, entry.capacity)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, height: 400, overflowY: 'auto' }}>
            <Typography variant="h6" gutterBottom>Team Status</Typography>
            {teamData.map((member) => (
              <Box key={member.name} display="flex" alignItems="center" justifyContent="space-between" mb={2} p={1} sx={{ borderBottom: '1px solid #f1f5f9' }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar>{member.name[0]}</Avatar>
                  <Typography>{member.name}</Typography>
                </Box>
                <Chip label={member.burnoutRisk} color={member.burnoutRisk === 'High' ? 'error' : member.burnoutRisk === 'Medium' ? 'warning' : 'success'} size="small" />
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TeamWorkload;