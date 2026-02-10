import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, TextField, Button, List, ListItem, ListItemText, Chip, Divider, Avatar, IconButton } from '@mui/material';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { Send, SmartToy, Assignment, TrendingUp, EventAvailable, AttachMoney } from '@mui/icons-material';
import KPICard from '../components/KPICard';

// --- Sub-Component: Real-time AI Assistant ---
const AIAssistant = () => {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([{ role: 'bot', text: 'Hello! I can help you check your remaining leave or salary breakdown.' }]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newChat = [...chat, { role: 'user', text: input }];
    setChat(newChat);
    setInput('');
    // Simulate AI logic
    setTimeout(() => {
      setChat([...newChat, { role: 'bot', text: 'Processing your request in the ERP database...' }]);
    }, 800);
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <SmartToy color="primary" /> AI Business Assistant
      </Typography>
      <Box sx={{ flexGrow: 1, height: '200px', overflowY: 'auto', bgcolor: '#f8fafc', p: 2, borderRadius: 2, mb: 2 }}>
        {chat.map((msg, i) => (
          <Box key={i} sx={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', mb: 1 }}>
            <Paper 
              sx={{ 
                p: 1.5, 
                bgcolor: msg.role === 'user' ? 'primary.main' : 'grey.200', 
                color: msg.role === 'user' ? 'white' : 'text.primary',
                borderRadius: 2,
                maxWidth: '80%'
              }}
            >
              <Typography variant="body2">
              {msg.text}
              </Typography>
            </Paper>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField 
          fullWidth size="small" placeholder="Ask about payroll..." 
          value={input} onChange={(e) => setInput(e.target.value)} 
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <IconButton color="primary" onClick={handleSend}><Send /></IconButton>
      </Box>
    </Paper>
  );
};

const EmployeeDashboard = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Real-world implementation would fetch data from /api/employee/stats
    const salaryData = [
      { month: 'Oct', amount: 4200 }, { month: 'Nov', amount: 4500 },
      { month: 'Dec', amount: 4500 }, { month: 'Jan', amount: 4800 },
    ];
    setAttendance([{ name: 'Present', value: 21 }, { name: 'Absent', value: 1 }]);
    setLoading(false);
  }, []);

  const COLORS = ['#22c55e', '#ef4444'];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" color="#1e293b">Welcome Back, Alex</Typography>
        <Typography variant="body1" color="text.secondary">{new Date().toDateString()}</Typography>
      </Box>

      {/* Top Section: KPIs & Attendance */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <KPICard title="Attendance Rate" value="95.4%" icon={<EventAvailable />} trend={1.2} color="#10b981" />
        </Grid>
        <Grid item xs={12} md={4}>
          <KPICard title="Net Salary (Pending)" value="$4,800" icon={<AttachMoney />} color="#3b82f6" />
        </Grid>
        <Grid item xs={12} md={4}>
          <KPICard title="Active Tasks" value="3" icon={<Assignment />} color="#f59e0b" />
        </Grid>
      </Grid>

      {/* Middle Section: Tasks & AI */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Active Tasks</Typography>
            <List>
            {[
                { t: 'Q4 Financial Audit', d: 'High', c: '#ef4444' },
                { t: 'Update Security Protocols', d: 'Med', c: '#f59e0b' },
                { t: 'Onboard New Intern', d: 'Low', c: '#3b82f6' }
            ].map((task, i) => (
                <React.Fragment key={i}>
                  <ListItem>
                    <ListItemText primary={task.t} />
                    <Chip label={`${task.d} Priority`} size="small" sx={{ bgcolor: task.c, color: '#fff' }} />
                  </ListItem>
                  {i < 2 && <Divider />}
                </React.Fragment>
            ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={5}>
          <AIAssistant />
        </Grid>
      </Grid>

      {/* Bottom Section: Performance Chart */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
              <TrendingUp color="primary" /> Salary Growth & Performance
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={[
                    { name: 'Oct', val: 3000 }, { name: 'Nov', val: 3200 }, 
                    { name: 'Dec', val: 4500 }, { name: 'Jan', val: 4800 }
                ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="val" stroke="#3b82f6" fill="#dbeafe" />
                </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmployeeDashboard;