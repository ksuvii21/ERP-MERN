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
  MenuItem,
} from '@mui/material';
import { Add } from '@mui/icons-material';
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
  Passed: 'success',
  Failed: 'error',
};

const QualityManagement = () => {
  const [checks, setChecks] = useState([]);
  const [productionOrders, setProductionOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  const [newCheck, setNewCheck] = useState({
    productionOrder: null,
    status: 'Pending',
    notes: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const [checksRes, ordersRes] = await Promise.all([
          api.get('/quality?populate=product,productionOrder,inspectedBy'),
          api.get('/production?populate=product'),
        ]);
        setChecks(checksRes.data.data);
        setProductionOrders(ordersRes.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch quality data.');
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
    setNewCheck({ productionOrder: null, status: 'Pending', notes: '' });
  };

  const handleCheckChange = (e) => {
    setNewCheck({ ...newCheck, [e.target.name]: e.target.value });
  };

  const handleOrderSelect = (event, value) => {
    setNewCheck({ ...newCheck, productionOrder: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        productionOrder: newCheck.productionOrder?._id,
        product: newCheck.productionOrder?.product?._id,
        status: newCheck.status,
        notes: newCheck.notes,
      };

      if (!payload.productionOrder || !payload.product) {
        setError('Please select a production order.');
        return;
      }

      const res = await api.post('/quality', payload);
      // Refetch to get populated data from server
      const checksRes = await api.get('/quality?populate=product,productionOrder,inspectedBy');
      setChecks(checksRes.data.data);
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create quality check.');
      console.error(err);
    }
  };

  if (loading) return <Container><CircularProgress /></Container>;

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">Quality Management</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>Create Check</Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead><TableRow><TableCell>Product</TableCell><TableCell>Production Order ID</TableCell><TableCell>Status</TableCell><TableCell>Inspector</TableCell><TableCell>Date</TableCell></TableRow></TableHead>
          <TableBody>
            {checks.map((check) => (
              <TableRow key={check._id} hover>
                <TableCell>{check.product?.name || 'N/A'}</TableCell>
                <TableCell>{check.productionOrder?.orderNumber || check.productionOrder?._id.slice(-6) || 'N/A'}</TableCell>
                <TableCell><Chip label={check.status} color={statusColors[check.status]} size="small" /></TableCell>
                <TableCell>{check.inspectedBy?.name || 'N/A'}</TableCell>
                <TableCell>{new Date(check.inspectionDate).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" component="h2" mb={2}>New Quality Check</Typography>
          <form onSubmit={handleSubmit}>
            <Autocomplete options={productionOrders} getOptionLabel={(o) => `${o.product?.name} - Qty: ${o.quantityToProduce} (ID: ...${o._id.slice(-6)})`} value={newCheck.productionOrder} onChange={handleOrderSelect} isOptionEqualToValue={(o, v) => o._id === v._id} renderInput={(params) => <TextField {...params} label="Select Production Order" required />} sx={{ mb: 2 }} />
            <TextField select label="Status" name="status" value={newCheck.status} onChange={handleCheckChange} fullWidth required sx={{ mb: 2 }}>
              {['Pending', 'Passed', 'Failed'].map((option) => (<MenuItem key={option} value={option}>{option}</MenuItem>))}
            </TextField>
            <TextField label="Notes / Remarks" name="notes" value={newCheck.notes} onChange={handleCheckChange} fullWidth multiline rows={3} sx={{ mb: 2 }} />
            <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
              <Button onClick={handleClose} color="secondary">Cancel</Button>
              <Button type="submit" variant="contained">Save Check</Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Container>
  );
};

export default QualityManagement;