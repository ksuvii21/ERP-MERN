import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, CircularProgress,
  Box, Chip
} from '@mui/material';
import { LocalShipping } from '@mui/icons-material';
import api from '../../utils/api';

const Logistics = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const res = await api.get('wholesale/shipments');
        setShipments(res.data);
      } catch (err) {
        console.error('Failed to fetch shipments', err);
      } finally {
        setLoading(false);
      }
    };
    fetchShipments();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'success';
      case 'Out for Delivery': return 'info';
      case 'In Transit': return 'primary';
      case 'Processing': return 'warning';
      default: return 'default';
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box>;

  return (
    <Container>
      <Box display="flex" alignItems="center" gap={2} mb={4}>
        <LocalShipping color="primary" sx={{ fontSize: 32 }} />
        <Typography variant="h4" fontWeight="bold">Logistics & Tracking</Typography>
      </Box>

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell>Tracking #</TableCell>
              <TableCell>Order ID</TableCell>
              <TableCell>Carrier</TableCell>
              <TableCell>Est. Delivery</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shipments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">No active shipments found.</TableCell>
              </TableRow>
            ) : (
              shipments.map((shipment) => (
                <TableRow key={shipment._id} hover>
                  <TableCell sx={{ fontWeight: 'medium', color: 'primary.main' }}>
                    {shipment.trackingNumber}
                  </TableCell>
                  <TableCell>{shipment.orderId?.orderNumber || 'N/A'}</TableCell>
                  <TableCell>{shipment.carrier}</TableCell>
                  <TableCell>
                    {shipment.estimatedDelivery 
                      ? new Date(shipment.estimatedDelivery).toLocaleDateString() 
                      : 'TBD'}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={shipment.status} 
                      size="small" 
                      color={getStatusColor(shipment.status)} 
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Logistics;