import React, { useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, LinearProgress, Button } from '@mui/material';
import { Warning, CheckCircle, Schedule, ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ProjectList = () => {
  const navigate = useNavigate();
  
  // Mock Data with AI Predictions
  const [projects] = useState([
    { id: 1, name: 'ERP Migration', status: 'In Progress', progress: 65, deadline: '2026-03-01', aiRisk: 85, riskReason: 'Scope Creep Detected' },
    { id: 2, name: 'Mobile App Revamp', status: 'On Track', progress: 40, deadline: '2026-04-15', aiRisk: 12, riskReason: 'Stable' },
    { id: 3, name: 'Q1 Marketing Campaign', status: 'At Risk', progress: 20, deadline: '2026-02-20', aiRisk: 92, riskReason: 'Resource Shortage' },
    { id: 4, name: 'Internal Audit', status: 'Completed', progress: 100, deadline: '2026-01-10', aiRisk: 0, riskReason: 'Completed' },
  ]);

  const getRiskColor = (score) => {
    if (score > 75) return 'error';
    if (score > 40) return 'warning';
    return 'success';
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">Project Portfolio</Typography>
        <Button variant="contained" onClick={() => navigate('/app/kanban')}>
          Go to Kanban Board
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f8fafc' }}>
            <TableRow>
              <TableCell><strong>Project Name</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Progress</strong></TableCell>
              <TableCell><strong>Deadline</strong></TableCell>
              <TableCell><strong>AI Deadline Risk</strong></TableCell>
              <TableCell><strong>Action</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id} hover>
                <TableCell>{project.name}</TableCell>
                <TableCell>
                  <Chip 
                    label={project.status} 
                    color={project.status === 'Completed' ? 'success' : project.status === 'At Risk' ? 'error' : 'primary'} 
                    size="small" 
                    variant="outlined"
                  />
                </TableCell>
                <TableCell sx={{ width: 200 }}>
                  <Box display="flex" alignItems="center">
                    <Box width="100%" mr={1}>
                      <LinearProgress variant="determinate" value={project.progress} />
                    </Box>
                    <Box minWidth={35}>
                      <Typography variant="body2" color="text.secondary">{`${project.progress}%`}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{project.deadline}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    {project.aiRisk > 50 ? <Warning color="error" fontSize="small" /> : <CheckCircle color="success" fontSize="small" />}
                    <Typography variant="body2" fontWeight="bold" color={`${getRiskColor(project.aiRisk)}.main`}>
                      {project.aiRisk}% ({project.riskReason})
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Button size="small" endIcon={<ArrowForward />}>Details</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProjectList;