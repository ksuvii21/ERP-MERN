import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Paper, CircularProgress, Tabs, Tab, Modal,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Grid,
  TextField, IconButton
} from '@mui/material';
import { CheckCircle, HourglassEmpty, LocalPharmacy, Inventory, Warning, Add, Delete } from '@mui/icons-material';
import api from '../../utils/api';

// --- Sub-components ---

const ExpiryHeatmap = ({ inventory }) => {
  const getExpiryData = () => {
    const now = new Date();
    const data = {
      expiringSoon: 0, // < 30 days
      expiringLater: 0, // 30-90 days
      safe: 0,
    };
    if (!inventory) return data;

    inventory.forEach(med => {
      med.batches.forEach(batch => {
        const expiry = new Date(batch.expiryDate);
        const diffDays = (expiry - now) / (1000 * 60 * 60 * 24);
        if (diffDays <= 30) data.expiringSoon++;
        else if (diffDays <= 90) data.expiringLater++;
        else data.safe++;
      });
    });
    return data;
  };

  const expiryData = getExpiryData();

  return (
    <Paper sx={{ p: 2, height: '100%', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Expiry Heatmap</Typography>
      <Box display="flex" justifyContent="space-around" textAlign="center">
        <Box>
          <Typography variant="h4" sx={{ color: '#ef4444', fontWeight: 700 }}>{expiryData.expiringSoon}</Typography>
          <Typography variant="caption">Expiring in &lt;30 days</Typography>
        </Box>
        <Box>
          <Typography variant="h4" sx={{ color: '#f59e0b', fontWeight: 700 }}>{expiryData.expiringLater}</Typography>
          <Typography variant="caption">Expiring in 30-90 days</Typography>
        </Box>
        <Box>
          <Typography variant="h4" sx={{ color: '#22c55e', fontWeight: 700 }}>{expiryData.safe}</Typography>
          <Typography variant="caption">Safe (&gt;90 days)</Typography>
        </Box>
      </Box>
    </Paper>
  );
};

const DispenseQueue = ({ queue, onUpdate }) => {
  const getUrgencyChip = (urgency) => {
    if (urgency === 'Stat') return <Chip label="STAT" color="error" size="small" />;
    if (urgency === 'Urgent') return <Chip label="Urgent" color="warning" size="small" />;
    return <Chip label="Routine" color="info" size="small" />;
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Patient</TableCell>
            <TableCell>Prescribed By</TableCell>
            <TableCell>Medicines</TableCell>
            <TableCell>Urgency</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {queue.map((rx) => (
            <TableRow key={rx._id} hover>
              <TableCell>
                <Typography fontWeight="600">{rx.patient?.name || 'N/A'}</Typography>
                <Typography variant="caption">{rx.patient?.age || 'N/A'} Yrs</Typography>
              </TableCell>
              <TableCell>{rx.doctor?.name || 'N/A'}</TableCell>
              <TableCell>
                {rx.medicines.map(m => (
                  <Typography key={m._id} variant="body2">{m.medicine?.name || 'N/A'} - {m.dosage}</Typography>
                ))}
              </TableCell>
              <TableCell>{getUrgencyChip(rx.urgency)}</TableCell>
              <TableCell>
                {rx.status === 'Pending' && (
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<CheckCircle />}
                    onClick={() => onUpdate(rx._id, 'Approved')}
                  >
                    Verify
                  </Button>
                )}
                {rx.status === 'Approved' && (
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    startIcon={<LocalPharmacy />}
                    onClick={() => onUpdate(rx._id, 'Dispensed')}
                  >
                    Dispense
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const InventoryList = ({ inventory }) => (
  <TableContainer>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Medicine Name</TableCell>
          <TableCell>Category</TableCell>
          <TableCell>Total Stock</TableCell>
          <TableCell>Reorder Level</TableCell>
          <TableCell>Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {inventory.map((item) => (
          <TableRow key={item._id} hover>
            <TableCell sx={{ fontWeight: 600 }}>{item.name}</TableCell>
            <TableCell>{item.category}</TableCell>
            <TableCell>{item.totalStock} {item.unit}s</TableCell>
            <TableCell>{item.reorderLevel}</TableCell>
            <TableCell>
              {item.totalStock <= item.reorderLevel ? (
                <Chip label="Reorder" color="warning" size="small" icon={<Warning />} />
              ) : (
                <Chip label="In Stock" color="success" size="small" />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  border: '1px solid #ccc',
  borderRadius: '12px',
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto',
};

const Pharmacy = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dispenseQueue, setDispenseQueue] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    category: '',
    salePrice: '',
    reorderLevel: '',
    batches: [{ batchNumber: '', quantity: '', expiryDate: '' }]
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [queueRes, inventoryRes] = await Promise.all([
        api.get('/pharmacy/dispense-queue'),
        api.get('/pharmacy/inventory'),
      ]);
      setDispenseQueue(queueRes.data);
      setInventory(inventoryRes.data);
    } catch (err) {
      console.error("Failed to fetch pharmacy data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdatePrescription = async (id, status) => {
    try {
      await api.put(`/pharmacy/prescriptions/${id}/status`, { status });
      // Refresh data to show the change
      fetchData();
    } catch (err) {
      alert('Failed to update prescription status.');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewMedicine({
      name: '', category: '', salePrice: '', reorderLevel: '',
      batches: [{ batchNumber: '', quantity: '', expiryDate: '' }]
    });
  };

  const handleMedicineChange = (e) => {
    setNewMedicine({ ...newMedicine, [e.target.name]: e.target.value });
  };
  

  const handleBatchChange = (index, e) => {
    const updatedBatches = [...newMedicine.batches];
    updatedBatches[index][e.target.name] = e.target.value;
    setNewMedicine({ ...newMedicine, batches: updatedBatches });
  };

  const addBatchField = () => {
    setNewMedicine({
      ...newMedicine,
      batches: [...newMedicine.batches, { batchNumber: '', quantity: '', expiryDate: '' }]
    });
  };

  const removeBatchField = (index) => {
    const updatedBatches = newMedicine.batches.filter((_, i) => i !== index);
    setNewMedicine({ ...newMedicine, batches: updatedBatches });
  };

  const handleAddMedicine = async () => {
    try {
      if (!newMedicine.name || !newMedicine.category || !newMedicine.salePrice) {
        alert('Please fill all main medicine required fields (Name, Category, Sale Price).');
        return;
      }
      
      // Validate batches
      for (const batch of newMedicine.batches) {
        if (!batch.batchNumber || !batch.quantity || !batch.expiryDate) {
          alert('Please fill all required fields for each batch (Batch Number, Quantity, Expiry Date).');
          return;
        }
        if (isNaN(Number(batch.quantity)) || Number(batch.quantity) <= 0) {
          alert('Batch quantity must be a positive number.');
          return;
        }
        if (new Date(batch.expiryDate) < new Date()) {
            alert('Expiry date cannot be in the past.');
            return;
        }
      }

      // Prepare payload, converting numeric fields and handling optional ones
      const payload = {
        ...newMedicine,
        salePrice: Number(newMedicine.salePrice),
        reorderLevel: newMedicine.reorderLevel ? Number(newMedicine.reorderLevel) : undefined, // Convert to number or undefined
        batches: newMedicine.batches.map(batch => ({
          ...batch,
          quantity: Number(batch.quantity),
        }))
      };

      await api.post('/pharmacy/inventory', payload); // Send the prepared payload
      handleModalClose();
      fetchData();
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 400 && err.response.data) {
        let errorMessage = 'Validation failed: ';
        if (err.response.data.message === 'Validation Error' && err.response.data.errors) {
          const errors = err.response.data.errors;
          for (const key in errors) {
            errorMessage += `\n- ${errors[key].message}`;
          }
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message; // General 400 message from backend
        }
        alert(errorMessage);
      } else {
        alert('Failed to add medicine. Check console for details.');
      }
    }
  };


  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>Pharmacy Control Center</Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="Dispensing Queue" icon={<HourglassEmpty />} iconPosition="start" />
          <Tab label="Inventory Management" icon={<Inventory />} iconPosition="start" />
        </Tabs>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>
      ) : (
        <>
          {tabValue === 0 && (
            <Paper sx={{ p: 2, borderRadius: '12px' }}>
              <DispenseQueue queue={dispenseQueue} onUpdate={handleUpdatePrescription} />
            </Paper>
          )}

          {tabValue === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <ExpiryHeatmap inventory={inventory} />
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">Full Inventory List</Typography>
                  <Button variant="contained" startIcon={<Add />} onClick={() => setIsModalOpen(true)}>
                    Add New Medicine
                  </Button>
                </Box>
                <Paper sx={{ p: 2, borderRadius: '12px' }}>
                  <InventoryList inventory={inventory} />
                </Paper>
              </Grid>
            </Grid>
          )}
        </>
      )}

      <Modal open={isModalOpen} onClose={handleModalClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" mb={3}>Add New Medicine to Inventory</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}><TextField label="Medicine Name" name="name" value={newMedicine.name} onChange={handleMedicineChange} fullWidth required /></Grid>
            <Grid item xs={12} sm={6}><TextField label="Category" name="category" value={newMedicine.category} onChange={handleMedicineChange} fullWidth required /></Grid>
            <Grid item xs={12} sm={6}><TextField label="Sale Price" name="salePrice" type="number" value={newMedicine.salePrice} onChange={handleMedicineChange} fullWidth required /></Grid>
            <Grid item xs={12} sm={6}><TextField label="Reorder Level" name="reorderLevel" type="number" value={newMedicine.reorderLevel} onChange={handleMedicineChange} fullWidth /></Grid>
          </Grid>
          <Typography variant="subtitle1" mt={3} mb={2}>Stock Batches</Typography>
          {newMedicine.batches.map((batch, index) => (
            <Grid container spacing={2} key={index} alignItems="center" sx={{ mb: 1 }}>
              <Grid item xs={4}><TextField label="Batch Number" name="batchNumber" value={batch.batchNumber} onChange={(e) => handleBatchChange(index, e)} fullWidth required /></Grid>
              <Grid item xs={3}><TextField label="Quantity" name="quantity" type="number" value={batch.quantity} onChange={(e) => handleBatchChange(index, e)} fullWidth required /></Grid>
              <Grid item xs={4}>
                <TextField
                  label="Expiry Date"
                  name="expiryDate"
                  type="date"
                  value={batch.expiryDate}
                  onChange={(e) => handleBatchChange(index, e)}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={1}>
                <IconButton onClick={() => removeBatchField(index)} color="error" disabled={newMedicine.batches.length <= 1}>
                  <Delete />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Button
            startIcon={<Add />}
            onClick={addBatchField}
            sx={{ mt: 1 }}
          >
            Add Another Batch
          </Button>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={handleModalClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleAddMedicine} variant="contained">
              Save Medicine
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default Pharmacy;