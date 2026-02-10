import React, { useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText } from '@mui/material';
import { AutoAwesome, EventAvailable } from '@mui/icons-material';

const EmployeeManagement = () => {
  // Mock Data
  const [employees] = useState([
    { id: 1, name: 'Alice Johnson', role: 'Frontend Dev', skills: ['React', 'CSS'], matchScore: 92 },
    { id: 2, name: 'Bob Smith', role: 'Backend Dev', skills: ['Node.js', 'SQL'], matchScore: 88 },
    { id: 3, name: 'Charlie Brown', role: 'Designer', skills: ['Figma', 'Sketch'], matchScore: 75 },
  ]);

  const [openAttendance, setOpenAttendance] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);

  const handleViewAttendance = (emp) => {
    setSelectedEmp(emp);
    setOpenAttendance(true);
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Employee Management</Typography>
        <Button variant="contained" startIcon={<AutoAwesome />} color="secondary">
          Run Skill Match AI
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f8fafc' }}>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Role</strong></TableCell>
              <TableCell><strong>Top Skills</strong></TableCell>
              <TableCell><strong>Job Fit Score (AI)</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((emp) => (
              <TableRow key={emp.id} hover>
                <TableCell>{emp.name}</TableCell>
                <TableCell>{emp.role}</TableCell>
                <TableCell>
                  {emp.skills.map(skill => (
                    <Chip key={skill} label={skill} size="small" sx={{ mr: 0.5 }} />
                  ))}
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Box sx={{ width: '100%', mr: 1 }}>
                        <div style={{ height: 8, width: '100%', backgroundColor: '#e2e8f0', borderRadius: 4 }}>
                            <div style={{ height: 8, width: `${emp.matchScore}%`, backgroundColor: emp.matchScore > 90 ? '#22c55e' : '#3b82f6', borderRadius: 4 }}></div>
                        </div>
                    </Box>
                    <Typography variant="body2" color="text.secondary">{emp.matchScore}%</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Button size="small" color="primary">Edit</Button>
                  <Button size="small" color="secondary" startIcon={<EventAvailable />} onClick={() => handleViewAttendance(emp)}>Attendance</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Attendance Log Dialog */}
      <Dialog open={openAttendance} onClose={() => setOpenAttendance(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Attendance Log: {selectedEmp?.name}</DialogTitle>
        <DialogContent>
            <List>
                {[
                    { date: '2026-02-10', status: 'Present', in: '09:00 AM', out: '06:00 PM' },
                    { date: '2026-02-09', status: 'Present', in: '09:15 AM', out: '06:10 PM' },
                    { date: '2026-02-08', status: 'Absent', in: '-', out: '-' },
                    { date: '2026-02-07', status: 'Present', in: '08:55 AM', out: '05:55 PM' },
                ].map((log, index) => (
                    <ListItem key={index} divider>
                        <ListItemText 
                            primary={log.date} 
                            secondary={`In: ${log.in} | Out: ${log.out}`} 
                        />
                        <Chip label={log.status} color={log.status === 'Present' ? 'success' : 'error'} size="small" />
                    </ListItem>
                ))}
            </List>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default EmployeeManagement;