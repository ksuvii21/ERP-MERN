import React, { useState } from 'react';
import { 
  Box, Grid, Paper, Typography, Button, Card, CardContent, 
  Avatar, LinearProgress, Chip, Stack 
} from '@mui/material';
import { 
  Clock, Calendar, CheckSquare, Coffee, Briefcase, ChevronRight 
} from 'lucide-react';

const EmployeeDashboard = () => {
  const [clockedIn, setClockedIn] = useState(false);

  const tasks = [
    { id: 1, title: 'Complete Q1 Report', deadline: 'Today', progress: 80, priority: 'High' },
    { id: 2, title: 'Update Client Records', deadline: 'Tomorrow', progress: 45, priority: 'Medium' },
    { id: 3, title: 'Safety Training', deadline: 'Fri, 24th', progress: 0, priority: 'Low' },
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 3, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* Welcome Section */}
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
            <Typography variant="h4" fontWeight={700} color="#1e293b">Good Morning, Alex!</Typography>
            <Typography variant="body1" color="textSecondary">Here is what's happening today.</Typography>
        </Box>
        <Button variant="contained" startIcon={<Briefcase size={18} />} sx={{ borderRadius: 2, textTransform: 'none' }}>
            View My Profile
        </Button>
      </Box>

      <Grid container spacing={3}>
        
        {/* Left Column: Attendance & Stats */}
        <Grid item xs={12} md={4}>
            {/* Clock In Widget */}
            <Paper sx={{ p: 3, borderRadius: 3, mb: 3, background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: 'white' }}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Clock size={24} />
                    <Typography variant="h6" fontWeight={600}>Attendance</Typography>
                </Box>
                <Typography variant="h3" fontWeight={700} mb={1}>
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, mb: 3 }}>
                    {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </Typography>
                
                <Button 
                    variant="contained" 
                    fullWidth 
                    onClick={() => setClockedIn(!clockedIn)}
                    sx={{ 
                        bgcolor: clockedIn ? '#ef4444' : '#ffffff', 
                        color: clockedIn ? '#fff' : '#2563eb',
                        fontWeight: 'bold',
                        '&:hover': { bgcolor: clockedIn ? '#dc2626' : '#f8fafc' }
                    }}
                >
                    {clockedIn ? 'Clock Out' : 'Clock In'}
                </Button>
                {clockedIn && <Typography variant="caption" display="block" textAlign="center" mt={1}>Started at 09:00 AM</Typography>}
            </Paper>

            {/* Leave Balance */}
            <Card sx={{ borderRadius: 3, border: 'none', boxShadow: '0px 4px 20px rgba(0,0,0,0.05)' }}>
                <CardContent>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <Coffee size={20} color="#64748b" />
                        <Typography variant="h6" fontWeight={600} color="text.primary">Leave Balance</Typography>
                    </Box>
                    <Stack direction="row" spacing={2}>
                        <Box flex={1} p={1.5} bgcolor="#f1f5f9" borderRadius={2} textAlign="center">
                            <Typography variant="h5" fontWeight="bold" color="primary.main">12</Typography>
                            <Typography variant="caption" color="textSecondary">Casual</Typography>
                        </Box>
                        <Box flex={1} p={1.5} bgcolor="#f1f5f9" borderRadius={2} textAlign="center">
                            <Typography variant="h5" fontWeight="bold" color="success.main">5</Typography>
                            <Typography variant="caption" color="textSecondary">Sick</Typography>
                        </Box>
                        <Box flex={1} p={1.5} bgcolor="#f1f5f9" borderRadius={2} textAlign="center">
                            <Typography variant="h5" fontWeight="bold" color="warning.main">8</Typography>
                            <Typography variant="caption" color="textSecondary">Privilege</Typography>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
        </Grid>

        {/* Right Column: Tasks & Updates */}
        <Grid item xs={12} md={8}>
            <Paper sx={{ p: 0, borderRadius: 3, overflow: 'hidden', height: '100%', boxShadow: '0px 4px 20px rgba(0,0,0,0.05)' }}>
                <Box p={3} borderBottom="1px solid #f1f5f9" display="flex" justifyContent="space-between">
                    <Box display="flex" alignItems="center" gap={1}>
                        <CheckSquare size={20} color="#64748b" />
                        <Typography variant="h6" fontWeight={600}>My Tasks</Typography>
                    </Box>
                    <Button size="small" endIcon={<ChevronRight size={16} />}>View All</Button>
                </Box>
                
                <Box p={3}>
                    {tasks.map((task) => (
                        <Box key={task.id} mb={3}>
                            <Box display="flex" justifyContent="space-between" mb={1}>
                                <Typography variant="subtitle2" fontWeight={600}>{task.title}</Typography>
                                <Chip label={task.deadline} size="small" variant="outlined" sx={{ borderRadius: 1 }} />
                            </Box>
                            <LinearProgress variant="determinate" value={task.progress} sx={{ borderRadius: 5, height: 6, mb: 1, bgcolor: '#f1f5f9', '& .MuiLinearProgress-bar': { bgcolor: task.progress > 70 ? '#22c55e' : '#3b82f6' } }} />
                            <Typography variant="caption" color="textSecondary">{task.progress}% Complete • {task.priority} Priority</Typography>
                        </Box>
                    ))}
                </Box>
            </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmployeeDashboard;