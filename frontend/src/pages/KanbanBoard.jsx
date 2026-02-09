import React, { useState } from 'react';
import { Box, Typography, Grid, Paper, Card, CardContent, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Avatar } from '@mui/material';
import { MoreVert, AutoAwesome, AccessTime } from '@mui/icons-material';

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Fix Login Bug', status: 'Todo', priority: 'High', aiScore: 95, assignee: 'AJ' },
    { id: 2, title: 'Update API Docs', status: 'Todo', priority: 'Low', aiScore: 40, assignee: 'BS' },
    { id: 3, title: 'Design Dashboard', status: 'In Progress', priority: 'Medium', aiScore: 75, assignee: 'CB' },
    { id: 4, title: 'Database Backup', status: 'Done', priority: 'High', aiScore: 88, assignee: 'AJ' },
  ]);

  const [selectedTask, setSelectedTask] = useState(null);

  const columns = ['Todo', 'In Progress', 'Done'];

  // AI Feature: Sort by AI Importance Score
  const prioritizeTasks = () => {
    const sorted = [...tasks].sort((a, b) => b.aiScore - a.aiScore);
    setTasks(sorted);
  };

  return (
    <Box p={3} sx={{ height: '100vh', backgroundColor: '#f4f6f8' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">Task Board</Typography>
        <Button 
          variant="contained" 
          startIcon={<AutoAwesome />} 
          color="secondary"
          onClick={prioritizeTasks}
        >
          AI Prioritize
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ height: 'calc(100% - 80px)' }}>
        {columns.map((col) => (
          <Grid item xs={12} md={4} key={col}>
            <Paper sx={{ p: 2, height: '100%', backgroundColor: '#e2e8f0' }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#475569' }}>
                {col} <Chip label={tasks.filter(t => t.status === col).length} size="small" sx={{ ml: 1 }} />
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {tasks.filter(t => t.status === col).map((task) => (
                  <Card 
                    key={task.id} 
                    sx={{ cursor: 'pointer', '&:hover': { boxShadow: 3 } }}
                    onClick={() => setSelectedTask(task)}
                  >
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Chip 
                          label={task.priority} 
                          size="small" 
                          color={task.priority === 'High' ? 'error' : task.priority === 'Medium' ? 'warning' : 'default'} 
                        />
                        {task.aiScore > 80 && (
                          <Chip icon={<AutoAwesome sx={{ fontSize: 14 }} />} label="AI Top Pick" size="small" color="secondary" variant="outlined" />
                        )}
                      </Box>
                      <Typography variant="subtitle1" fontWeight="600">{task.title}</Typography>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                        <Box display="flex" alignItems="center" gap={0.5} color="text.secondary">
                          <AccessTime fontSize="small" />
                          <Typography variant="caption">2 days left</Typography>
                        </Box>
                        <Avatar sx={{ width: 24, height: 24, fontSize: 12, bgcolor: '#3b82f6' }}>{task.assignee}</Avatar>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Task Details Modal */}
      <Dialog open={!!selectedTask} onClose={() => setSelectedTask(null)} maxWidth="sm" fullWidth>
        {selectedTask && (
          <>
            <DialogTitle>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                {selectedTask.title}
                <IconButton onClick={() => setSelectedTask(null)}><MoreVert /></IconButton>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Typography variant="body1" gutterBottom><strong>Status:</strong> {selectedTask.status}</Typography>
              <Typography variant="body1" gutterBottom><strong>Assignee:</strong> {selectedTask.assignee}</Typography>
              <Typography variant="body1" gutterBottom><strong>AI Importance Score:</strong> {selectedTask.aiScore}/100</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Description: This task involves critical updates to the system. AI suggests completing this before the sprint ends due to dependencies.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedTask(null)}>Close</Button>
              <Button variant="contained" color="primary">Edit Task</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default KanbanBoard;