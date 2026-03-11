import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Box,
  Divider,
} from '@mui/material';
import api from '../../utils/api';

const SupplyChain = () => {
  const [data, setData] = useState({ suppliers: [], production: [], sales: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSupplyChainData = async () => {
      try {
        setLoading(true);
        const [suppliersRes, productionRes, salesRes] = await Promise.all([
          api.get('/suppliers?limit=5'),
          api.get('/production?populate=product&limit=5'),
          api.get('/sales?populate=createdBy&limit=5'),
        ]);
        setData({
          suppliers: suppliersRes.data,
          production: productionRes.data,
          sales: salesRes.data,
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch supply chain data.');
      } finally {
        setLoading(false);
      }
    };
    fetchSupplyChainData();
  }, []);

  if (loading) return <Container><CircularProgress /></Container>;

  return (
    <Container>
      <Box mb={4}>
        <Typography variant="h4" component="h1">Supply Chain Overview</Typography>
        <Typography variant="body2" color="text.secondary">A high-level view from procurement to production to sales.</Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {/* Suppliers Column */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Recent Suppliers</Typography>
            <List dense>
              {data.suppliers.map(s => (
                <ListItem key={s._id} disableGutters>
                  <ListItemText primary={s.name} secondary={s.email} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Production Column */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Recent Production Orders</Typography>
            <List dense>
              {data.production.map(p => (
                <ListItem key={p._id} disableGutters>
                  <ListItemText primary={`${p.quantityToProduce} x ${p.product?.name || 'N/A'}`} secondary={`Scheduled: ${new Date(p.scheduledDate).toLocaleDateString()}`} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Sales Column */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Recent Sales</Typography>
            <List dense>
              {data.sales.map(s => (
                <ListItem key={s._id} disableGutters>
                  <ListItemText primary={`Sale: $${s.totalAmount.toFixed(2)}`} secondary={`By: ${s.createdBy?.name || 'N/A'}`} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SupplyChain;