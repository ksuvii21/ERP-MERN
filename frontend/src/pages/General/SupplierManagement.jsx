import React, { useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Rating, Chip, Button, LinearProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { LocalShipping, Star, AddShoppingCart, RateReview } from '@mui/icons-material';

const SupplierManagement = () => {
  // Mock Data with AI Scores
  const [suppliers] = useState([
    { id: 1, name: 'TechGlobal Distributors', contact: 'alice@techglobal.com', category: 'Electronics', aiScore: 92, deliverySpeed: 'Fast', quality: 'High' },
    { id: 2, name: 'Office Supplies Co.', contact: 'bob@officesupplies.com', category: 'Stationery', aiScore: 78, deliverySpeed: 'Average', quality: 'Medium' },
    { id: 3, name: 'MegaParts Ltd.', contact: 'support@megaparts.com', category: 'Hardware', aiScore: 45, deliverySpeed: 'Slow', quality: 'Low' },
  ]);

  const [openRate, setOpenRate] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const getScoreColor = (score) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'primary';
    if (score >= 50) return 'warning';
    return 'error';
  };

  const handleRate = (supplier) => {
    setSelectedSupplier(supplier);
    setOpenRate(true);
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">Supplier Management</Typography>
        <Button variant="contained" startIcon={<LocalShipping />}>Add Supplier</Button>
      </Box>

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f8fafc' }}>
            <TableRow>
              <TableCell><strong>Supplier Name</strong></TableCell>
              <TableCell><strong>Category</strong></TableCell>
              <TableCell><strong>Contact</strong></TableCell>
              <TableCell><strong>AI Performance Score</strong></TableCell>
              <TableCell><strong>Insights</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier.id} hover>
                <TableCell>{supplier.name}</TableCell>
                <TableCell>{supplier.category}</TableCell>
                <TableCell>{supplier.contact}</TableCell>
                <TableCell sx={{ width: 250 }}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box width="100%">
                      <LinearProgress 
                        variant="determinate" 
                        value={supplier.aiScore} 
                        color={getScoreColor(supplier.aiScore)} 
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    <Typography variant="body2" fontWeight="bold">{supplier.aiScore}/100</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    <Chip label={supplier.deliverySpeed} size="small" variant="outlined" />
                    <Chip label={supplier.quality} size="small" variant="outlined" />
                  </Box>
                </TableCell>
                <TableCell>
                  <Button size="small" color="primary">Details</Button>
                  <Button size="small" color="secondary" startIcon={<RateReview />} onClick={() => handleRate(supplier)}>Rate</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Rating Dialog */}
      <Dialog open={openRate} onClose={() => setOpenRate(false)}>
        <DialogTitle>Rate Supplier: {selectedSupplier?.name}</DialogTitle>
        <DialogContent sx={{ minWidth: 400 }}>
            <Box display="flex" flexDirection="column" gap={2} mt={1}>
                <Typography component="legend">Delivery Speed</Typography>
                <Rating name="speed" defaultValue={3} />
                <Typography component="legend">Product Quality</Typography>
                <Rating name="quality" defaultValue={4} />
                <TextField multiline rows={3} label="Comments" fullWidth />
            </Box>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setOpenRate(false)}>Cancel</Button>
            <Button variant="contained" onClick={() => setOpenRate(false)}>Submit Rating</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SupplierManagement;