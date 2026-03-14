import React from 'react';
import { Container, Typography, Grid, Paper, Box, LinearProgress } from '@mui/material';

const ProjectManagement = () => {
  return (
    <Container>
      <Typography variant="h4" fontWeight="bold" mb={4}>Business Projects</Typography>
      <Grid container spacing={3}>
        {['Website Redesign', 'Annual Audit', 'Product Launch'].map((proj, i) => (
          <Grid item xs={12} md={4} key={i}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" mb={1}>{proj}</Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>Deadline: Dec 2024</Typography>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="caption">Progress</Typography>
                <Typography variant="caption">65%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={65} sx={{ height: 8, borderRadius: 5 }} />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
export default ProjectManagement;