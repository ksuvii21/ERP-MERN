import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Paper, LinearProgress, Box, CircularProgress, Chip } from '@mui/material';
import { Warehouse as WarehouseIcon, Room } from '@mui/icons-material';
import api from '../../utils/api';

const WarehouseManagement = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const res = await api.get('wholesale/warehouses');
        setWarehouses(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchWarehouses();
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <Container>
      <Typography variant="h4" fontWeight="bold" mb={4}>Warehouse Inventory & Space</Typography>
      <Grid container spacing={3}>
        {warehouses.map((w) => {
          const occupancy = (w.currentOccupancy / w.capacity) * 100;
          return (
            <Grid item xs={12} md={6} key={w._id}>
              <Paper sx={{ p: 3, borderLeft: '5px solid #0d9488' }}>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">{w.name}</Typography>
                    <Box display="flex" alignItems="center" color="text.secondary">
                      <Room sx={{ fontSize: 16, mr: 0.5 }} />
                      <Typography variant="body2">{w.location}</Typography>
                    </Box>
                  </Box>
                  <WarehouseIcon color="disabled" sx={{ fontSize: 40 }} />
                </Box>
                
                <Box mb={1} display="flex" justifyContent="space-between">
                  <Typography variant="body2">Capacity Usage</Typography>
                  <Typography variant="body2" fontWeight="bold">{occupancy.toFixed(1)}%</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={occupancy} 
                  sx={{ height: 8, borderRadius: 5, mb: 2, bgcolor: '#e2e8f0', '& .MuiLinearProgress-bar': { bgcolor: occupancy > 90 ? '#ef4444' : '#0d9488' } }} 
                />
                <Box display="flex" gap={1}>
                  <Chip label={`Manager: ${w.manager || 'N/A'}`} size="small" variant="outlined" />
                  <Chip label={`${w.capacity} Units Total`} size="small" variant="outlined" />
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default WarehouseManagement;