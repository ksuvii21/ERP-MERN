import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

const KPICard = ({ title, value, icon, trend, color }) => {
  return (
    <Paper elevation={2} sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', overflow: 'hidden', borderRadius: 3 }}>
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '6px', height: '100%', background: color || 'primary.main' }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'action.hover', color: 'text.primary', fontSize: '1.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {icon}
        </Box>
        {trend !== undefined && (
            <Typography variant="caption" sx={{ color: trend > 0 ? 'success.main' : 'error.main', fontWeight: 'bold', display: 'flex', alignItems: 'center', bgcolor: trend > 0 ? 'success.lighter' : 'error.lighter', px: 1, py: 0.5, borderRadius: 1 }}>
                {trend > 0 ? '▲' : '▼'} {Math.abs(trend)}%
            </Typography>
        )}
      </Box>
      <Typography variant="body2" color="text.secondary" fontWeight="600" sx={{ mb: 0.5 }}>
        {title}
      </Typography>
      <Typography variant="h4" fontWeight="bold" color="text.primary">
        {value}
      </Typography>
    </Paper>
  );
};

export default KPICard;