import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

const KPICard = ({ title, value, icon, color }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        height: 160,
        justifyContent: 'space-between',
        background: color || 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
        color: color ? 'white' : 'text.primary',
        borderRadius: 3,
        transition: '0.3s',
        '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Typography variant="subtitle1" fontWeight="600" sx={{ opacity: 0.9 }}>{title}</Typography>
        {icon && <Box sx={{ fontSize: '2rem', opacity: 0.8 }}>{icon}</Box>}
      </Box>
      <Typography variant="h3" fontWeight="700">{value}</Typography>
    </Paper>
  );
};

export default KPICard;