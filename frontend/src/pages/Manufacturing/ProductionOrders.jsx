import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Modal,
  Box,
  TextField,
  Autocomplete,
  Chip,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// Note: This assumes you have a configured API client.
import api from '../../utils/api';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '1px solid #ccc',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4,
};

const statusColors = {
  Pending: 'default',
  'In Progress': 'primary',
  Completed: 'success',
  Cancelled: 'error',
};

const ProductionOrders = () => {
  const [orders, setOrders] = useState([]);
  const [boms, setBoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  const [newOrder, setNewOrder] = useState({
    bom: null,
    quantityToProduce: 1,
    scheduledDate: new Date(),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const [ordersRes, bomsRes] = await Promise.all([
          api.get('/production?populate=product'),
          api.get('/boms?populate=product'), // populate product to show in dropdown
        ]);
        setOrders(ordersRes.data.data);
        setBoms(bomsRes.data.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            'Failed to fetch data. Ensure API endpoints for Production and BOMs are running.'
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewOrder({
      bom: null,
      quantityToProduce: 1,
      scheduledDate: new Date(),
    });
  };

  const handleBomSelect = (event, value) => {
    setNewOrder({ ...newOrder, bom: value });
  };

  const handleOrderChange = (e) => {
    setNewOrder({ ...newOrder, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setNewOrder({ ...newOrder, scheduledDate: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        bom: newOrder.bom?._id,
        product: newOrder.bom?.product?._id, // The product is derived from the BOM
        quantityToProduce: newOrder.quantityToProduce,
        scheduledDate: newOrder.scheduledDate,
      };

      if (!payload.bom || !payload.product) {
        setError('Please select a Bill of Materials.');
        return;
      }

      const res = await api.post('/production', payload);
      const createdOrder = { ...res.data.data, product: newOrder.bom.product };
      setOrders([...orders, createdOrder]);
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create Production Order.');
      console.error(err);
    }
  };

  if (loading) {
    return <Container><CircularProgress /></Container>;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" component="h1">
            Production Orders
          </Typography>
          <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
            Create Order
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Scheduled Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id} hover>
                  <TableCell>{order.product?.name || 'N/A'}</TableCell>
                  <TableCell>{order.quantityToProduce}</TableCell>
                  <TableCell>{new Date(order.scheduledDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip label={order.status} color={statusColors[order.status] || 'default'} size="small" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Modal open={open} onClose={handleClose}>
          <Box sx={style}>
            <Typography variant="h6" component="h2" mb={2}>Create New Production Order</Typography>
            <form onSubmit={handleSubmit}>
              <Autocomplete options={boms} getOptionLabel={(option) => `${option.name} (for ${option.product?.name || '...'})` || ''} value={newOrder.bom} onChange={handleBomSelect} isOptionEqualToValue={(option, value) => option._id === value._id} renderInput={(params) => <TextField {...params} label="Select Bill of Materials" required />} sx={{ mb: 2 }} />
              <TextField label="Quantity to Produce" name="quantityToProduce" type="number" value={newOrder.quantityToProduce} onChange={handleOrderChange} fullWidth required inputProps={{ min: 1 }} sx={{ mb: 2 }} />
              <DatePicker label="Scheduled Date" value={newOrder.scheduledDate} onChange={handleDateChange} renderInput={(params) => <TextField {...params} fullWidth required sx={{ mb: 2 }} />} />
              <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
                <Button onClick={handleClose} color="secondary">Cancel</Button>
                <Button type="submit" variant="contained">Create</Button>
              </Box>
            </form>
          </Box>
        </Modal>
      </Container>
    </LocalizationProvider>
  );
};

export default ProductionOrders;