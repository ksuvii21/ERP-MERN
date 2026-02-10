import React, { useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip, Dialog, DialogTitle, DialogContent, Stepper, Step, StepLabel, Grid, TextField, MenuItem } from '@mui/material';
import { Add, LocalShipping, Visibility, CheckCircle, Map } from '@mui/icons-material';

const Purchases = () => {
  const [purchases, setPurchases] = useState([
    { _id: '1', poNumber: 'PO-2026-001', supplierName: 'TechGlobal', totalAmount: 15000, status: 'In Transit', date: '2026-02-01', tracking: 'TRK123456' },
    { _id: '2', poNumber: 'PO-2026-002', supplierName: 'Office Supplies Co.', totalAmount: 2400, status: 'Ordered', date: '2026-02-05', tracking: '' },
    { _id: '3', poNumber: 'PO-2026-003', supplierName: 'MegaParts Ltd.', totalAmount: 8500, status: 'Received', date: '2026-01-20', tracking: 'TRK987654' },
  ]);

  const [openTrack, setOpenTrack] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);

  const steps = ['Ordered', 'Dispatched', 'In Transit', 'Received'];

  const getActiveStep = (status) => {
    return steps.indexOf(status) + 1;
  };

  const handleTrack = (po) => {
    setSelectedPO(po);
    setOpenTrack(true);
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">Purchase Orders & Supply Chain</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpenCreate(true)}>Create Purchase Order</Button>
      </Box>

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell><strong>PO Number</strong></TableCell>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Supplier</strong></TableCell>
              <TableCell><strong>Amount</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {purchases.map((purchase) => (
              <TableRow key={purchase._id}>
                <TableCell fontWeight="bold">{purchase.poNumber}</TableCell>
                <TableCell>{purchase.date}</TableCell>
                <TableCell>{purchase.supplierName || 'N/A'}</TableCell>
                <TableCell>${purchase.totalAmount}</TableCell>
                <TableCell>
                    <Chip 
                        label={purchase.status} 
                        color={purchase.status === 'Received' ? 'success' : purchase.status === 'In Transit' ? 'primary' : 'default'} 
                        size="small" 
                        icon={purchase.status === 'In Transit' ? <LocalShipping /> : undefined}
                    />
                </TableCell>
                <TableCell>
                    <Button size="small" startIcon={<Map />} onClick={() => handleTrack(purchase)}>Track</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Tracking Dialog */}
      <Dialog open={openTrack} onClose={() => setOpenTrack(false)} fullWidth maxWidth="md">
        <DialogTitle>Order Tracking: {selectedPO?.poNumber}</DialogTitle>
        <DialogContent sx={{ py: 4 }}>
            <Box sx={{ width: '100%', mt: 2 }}>
                <Stepper activeStep={getActiveStep(selectedPO?.status)} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>
            {selectedPO?.tracking && (
                <Box mt={4} p={2} bgcolor="#f0f9ff" borderRadius={2}>
                    <Typography variant="subtitle2">Carrier Tracking Number:</Typography>
                    <Typography variant="h6" color="primary">{selectedPO.tracking}</Typography>
                </Box>
            )}
        </DialogContent>
      </Dialog>

      {/* Create PO Dialog (Simplified) */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} fullWidth maxWidth="sm">
        <DialogTitle>New Purchase Order</DialogTitle>
        <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                    <TextField select fullWidth label="Select Supplier" defaultValue="">
                        <MenuItem value="TechGlobal">TechGlobal</MenuItem>
                        <MenuItem value="Office Supplies">Office Supplies Co.</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={12}>
                    <TextField fullWidth label="Items (Comma separated SKU)" />
                </Grid>
                <Grid item xs={6}>
                    <TextField fullWidth type="date" label="Expected Delivery" InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item xs={6}>
                    <Button variant="contained" fullWidth size="large" sx={{ height: '100%' }}>Create Order</Button>
                </Grid>
            </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Purchases;