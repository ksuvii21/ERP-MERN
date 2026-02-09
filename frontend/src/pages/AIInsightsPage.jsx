import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { Psychology, TrendingUp, WarningAmber } from '@mui/icons-material';

const AIInsightsPage = () => {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom fontWeight="bold">AI Strategic Insights</Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Psychology color="primary" fontSize="large" />
              <Typography variant="h6">Predictive Analysis</Typography>
            </Box>
            <Typography paragraph>
              Based on current sales velocity and historical data, Q2 revenue is projected to increase by <strong>15%</strong>. 
              Inventory levels for 'Electronics' should be increased by March 1st to meet anticipated demand.
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, height: '100%' }}>
             <Box display="flex" alignItems="center" gap={1} mb={2}>
              <WarningAmber color="error" fontSize="large" />
              <Typography variant="h6">Risk Assessment</Typography>
            </Box>
            <Typography paragraph>
              <strong>Supply Chain:</strong> Potential delay detected from 'TechGlobal Distributors' due to regional logistics issues. 
              Recommend diversifying supplier orders for critical components.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AIInsightsPage;