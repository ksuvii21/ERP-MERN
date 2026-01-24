import React from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { Add } from '@mui/icons-material';

const sampleInventory = [
  { id: 1, name: 'Laptop Pro X1', sku: 'LPX1-001', category: 'Electronics', quantity: 15, price: 1200, status: 'In Stock' },
  { id: 2, name: 'Wireless Mouse', sku: 'WM-002', category: 'Accessories', quantity: 50, price: 25, status: 'In Stock' },
  { id: 3, name: 'Office Chair', sku: 'OC-003', category: 'Furniture', quantity: 5, price: 150, status: 'Low Stock' },
  { id: 4, name: 'USB-C Cable', sku: 'USB-004', category: 'Accessories', quantity: 0, price: 10, status: 'Out of Stock' },
];

const Inventory = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Inventory Management</Typography>
        <Button variant="contained" startIcon={<Add />}>
          Add Product
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="inventory table">
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Price ($)</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sampleInventory.map((row) => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">{row.name}</TableCell>
                <TableCell>{row.sku}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell align="right">{row.quantity}</TableCell>
                <TableCell align="right">{row.price}</TableCell>
                <TableCell>
                  <Chip
                    label={row.status}
                    color={row.status === 'In Stock' ? 'success' : row.status === 'Low Stock' ? 'warning' : 'error'}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Inventory;