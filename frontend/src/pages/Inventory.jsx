import React, { useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, Chip, Alert, Button, TextField, MenuItem } from '@mui/material';
import { TrendingUp, Warning, Inventory as InventoryIcon, Add, Store, EventBusy, DeleteSweep } from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Inventory = () => {
  const [warehouseFilter, setWarehouseFilter] = useState('All');

  // Mock Data for Products & AI Predictions
  const [products] = useState([
    { id: 1, name: 'Dell XPS 15', category: 'Laptop', price: 1500, stock: 5, minStock: 10, predictedDemand: 'High', hsn: '8471', gst: 18, batch: 'DX-001', expiry: '2028-12-31', location: 'Main Warehouse', lastSaleDate: '2024-02-01', barcode: '1001' },
    { id: 2, name: 'Logitech MX Master', category: 'Accessories', price: 100, stock: 45, minStock: 20, predictedDemand: 'Stable', hsn: '8471', gst: 18, batch: 'LG-002', expiry: '2025-06-15', location: 'Store A', lastSaleDate: '2024-02-10', barcode: '1002' },
    { id: 3, name: 'Samsung 27" Monitor', category: 'Monitor', price: 350, stock: 2, minStock: 5, predictedDemand: 'Very High', hsn: '8528', gst: 18, batch: 'SM-003', expiry: '2026-11-20', location: 'Main Warehouse', lastSaleDate: '2024-02-12', barcode: '1003' },
    { id: 4, name: 'Paracetamol 500mg', category: 'Pharma', price: 5, stock: 200, minStock: 50, predictedDemand: 'High', hsn: '3004', gst: 12, batch: 'PM-99', expiry: '2024-03-01', location: 'Store B', lastSaleDate: '2024-01-20', barcode: '2001' },
    { id: 5, name: 'Legacy Router', category: 'Networking', price: 50, stock: 30, minStock: 10, predictedDemand: 'Low', hsn: '8517', gst: 18, batch: 'RT-old', expiry: 'N/A', location: 'Godown C', lastSaleDate: '2023-09-01', barcode: '3005' },
  ]);

  // Mock Data for AI Demand Forecasting
  const [forecastData] = useState([
    { month: 'Jan', actual: 40, predicted: 42 },
    { month: 'Feb', actual: 30, predicted: 35 },
    { month: 'Mar', actual: 50, predicted: 48 },
    { month: 'Apr', actual: 27, predicted: 39 },
    { month: 'May', actual: 18, predicted: 48 }, // Future/Predicted
    { month: 'Jun', actual: null, predicted: 55 }, // Future/Predicted
  ]);

  // Filter Logic
  const filteredProducts = warehouseFilter === 'All' ? products : products.filter(p => p.location === warehouseFilter);

  // Expiry & Dead Stock Logic
  const nearExpiry = products.filter(p => {
      if(p.expiry === 'N/A') return false;
      const days = (new Date(p.expiry) - new Date()) / (1000 * 60 * 60 * 24);
      return days < 30; 
  });

  const deadStock = products.filter(p => {
      const daysSinceSale = (new Date() - new Date(p.lastSaleDate)) / (1000 * 60 * 60 * 24);
      return daysSinceSale > 90 && p.stock > 0;
  });

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">Inventory & Assets</Typography>
        <Box display="flex" gap={2}>
            <TextField select size="small" value={warehouseFilter} onChange={(e) => setWarehouseFilter(e.target.value)} sx={{ width: 200 }} label="Filter by Location">
                <MenuItem value="All">All Locations</MenuItem>
                <MenuItem value="Main Warehouse">Main Warehouse</MenuItem>
                <MenuItem value="Store A">Store A</MenuItem>
                <MenuItem value="Store B">Store B</MenuItem>
                <MenuItem value="Godown C">Godown C</MenuItem>
            </TextField>
            <Button variant="contained" startIcon={<Add />}>Add Product</Button>
        </Box>
      </Box>

      <Grid container spacing={3} mb={4}>
        {/* AI Feature: Demand Forecasting */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3, height: 350 }}>
            <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
              <TrendingUp color="primary" /> AI Demand Forecasting
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="actual" stroke="#64748b" strokeWidth={2} name="Actual Sales" />
                <Line type="monotone" dataKey="predicted" stroke="#3b82f6" strokeWidth={3} strokeDasharray="5 5" name="AI Prediction" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* AI Feature: Low Stock Prediction */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 350, overflowY: 'auto' }}>
            <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
              <Warning color="error" /> Critical Alerts
            </Typography>
            
            {/* Low Stock */}
            {products.filter(p => p.stock <= p.minStock).map(p => (
              <Alert severity="error" sx={{ mb: 2 }} key={p.id}>
                <strong>{p.name}</strong> below safety stock! (Qty: {p.stock})
              </Alert>
            ))}

            {/* Expiry Alerts */}
            {nearExpiry.map(p => (
                <Alert severity="warning" sx={{ mb: 2 }} key={`exp-${p.id}`} icon={<EventBusy fontSize="inherit" />}>
                    <strong>{p.name}</strong> (Batch: {p.batch}) expires on {p.expiry}
                </Alert>
            ))}

            {/* Dead Stock Alerts */}
            {deadStock.map(p => (
                <Alert severity="info" sx={{ mb: 2 }} key={`dead-${p.id}`} icon={<DeleteSweep fontSize="inherit" />}>
                    <strong>{p.name}</strong> is Dead Stock. No sales since {p.lastSaleDate}.
                </Alert>
            ))}

            {products.every(p => p.stock > p.minStock) && nearExpiry.length === 0 && deadStock.length === 0 && (
              <Typography color="text.secondary">All systems healthy. No critical alerts.</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Products Table */}
      <Paper elevation={2}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#f8fafc' }}>
              <TableRow>
                <TableCell><strong>Product Name</strong></TableCell>
                <TableCell><strong>Category</strong></TableCell>
                <TableCell><strong>Price</strong></TableCell>
                <TableCell><strong>Batch / Barcode</strong></TableCell>
                <TableCell><strong>Stock Level</strong></TableCell>
                <TableCell><strong>Location</strong></TableCell>
                <TableCell><strong>Expiry</strong></TableCell>
                <TableCell><strong>AI Demand</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id} hover>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>
                    <Typography variant="body2">{product.batch}</Typography>
                    <Typography variant="caption" color="text.secondary">{product.barcode}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold" color={product.stock <= product.minStock ? 'error' : 'inherit'}>
                      {product.stock}
                    </Typography>
                  </TableCell>
                  <TableCell>{product.location}</TableCell>
                  <TableCell>{product.expiry}</TableCell>
                  <TableCell>
                    <Chip 
                      label={product.predictedDemand} 
                      color={product.predictedDemand === 'Very High' ? 'error' : product.predictedDemand === 'High' ? 'warning' : 'success'} 
                      size="small" 
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={product.stock > 0 ? 'In Stock' : 'Out of Stock'} 
                      color={product.stock > 0 ? 'success' : 'default'} 
                      size="small" 
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Inventory;