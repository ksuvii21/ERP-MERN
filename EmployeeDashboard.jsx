import React from 'react';
import { Grid, Box, Typography, Paper, List, ListItem, ListItemText, Chip, Divider } from '@mui/material';
import { Assignment, EventAvailable, Campaign } from '@mui/icons-material';
import KPICard from '../components/KPICard';

const EmployeeDashboard = () => {
  const tasks = [
    { id: 1, title: 'Complete Q1 Report', due: 'Tomorrow', status: 'High' },
    { id: 2, title: 'Update Client Database', due: 'Fri, 12th', status: 'Normal' },
    { id: 3, title: 'Team Meeting Prep', due: 'Mon, 15th', status: 'Normal' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1e293b' }}>
        My Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <KPICard title="Pending Tasks" value="5" icon={<Assignment />} color="#3b82f6" />
        </Grid>
        <Grid item xs={12} md={4}>
          <KPICard title="Attendance" value="95%" icon={<EventAvailable />} trend={2} color="#10b981" />
        </Grid>
        <Grid item xs={12} md={4}>
          <KPICard title="Leave Balance" value="12 Days" icon={<EventAvailable />} color="#f59e0b" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>My Tasks</Typography>
            <List>
              {tasks.map((task, index) => (
                <React.Fragment key={task.id}>
                  <ListItem secondaryAction={<Chip label={task.status} color={task.status === 'High' ? 'error' : 'primary'} size="small" />}>
                    <ListItemText primary={task.title} secondary={`Due: ${task.due}`} />
                  </ListItem>
                  {index < tasks.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2, bgcolor: '#f8fafc' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Campaign color="primary" /> Announcements
            </Typography>
            <Typography variant="body2" paragraph>
              🎉 Office party this Friday at 5 PM!
            </Typography>
            <Typography variant="body2" paragraph>
              ⚠️ System maintenance scheduled for Sunday.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmployeeDashboard;