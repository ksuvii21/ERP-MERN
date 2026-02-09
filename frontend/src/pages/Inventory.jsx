import React, { useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, Chip, Alert, Button } from '@mui/material';
import { TrendingUp, Warning, Inventory as InventoryIcon, Add } from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Inventory = () => {
  // Mock Data for Products & AI Predictions
  const [products] = useState([
    { id: 1, name: 'Dell XPS 15', category: 'Laptop', price: 1500, stock: 5, minStock: 10, predictedDemand: 'High' },
    { id: 2, name: 'Logitech MX Master', category: 'Accessories', price: 100, stock: 45, minStock: 20, predictedDemand: 'Stable' },
    { id: 3, name: 'Samsung 27" Monitor', category: 'Monitor', price: 350, stock: 2, minStock: 5, predictedDemand: 'Very High' },
    { id: 4, name: 'Ergo Chair', category: 'Furniture', price: 500, stock: 12, minStock: 10, predictedDemand: 'Low' },
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

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">Inventory & Assets</Typography>
        <Button variant="contained" startIcon={<Add />}>Add Product</Button>
      </Box>

      <Grid container spacing={3} mb={4}>
        {/* AI Feature: Demand Forecasting */}
        <Grid item xs={12} md={8}>
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
              <Warning color="error" /> Low Stock Alerts
            </Typography>
            {products.filter(p => p.stock <= p.minStock).map(p => (
              <Alert severity="error" sx={{ mb: 2 }} key={p.id}>
                <strong>{p.name}</strong> is below safety stock!
                <br />
                Current: {p.stock} | Min: {p.minStock}
                <br />
                <Chip label={`Demand: ${p.predictedDemand}`} size="small" color="warning" sx={{ mt: 1 }} />
              </Alert>
            ))}
            {products.every(p => p.stock > p.minStock) && (
              <Typography color="text.secondary">All stock levels are healthy.</Typography>
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
                <TableCell><strong>Stock Level</strong></TableCell>
                <TableCell><strong>AI Demand</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} hover>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>
                    <Typography fontWeight="bold" color={product.stock <= product.minStock ? 'error' : 'inherit'}>
                      {product.stock}
                    </Typography>
                  </TableCell>
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