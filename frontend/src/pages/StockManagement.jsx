import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tab, Tabs, Chip } from '@mui/material';
import { AddCircle, RemoveCircle, History } from '@mui/icons-material';

const StockManagement = () => {
  const [tabValue, setTabValue] = useState(0);
  const [movements, setMovements] = useState([
    { id: 1, item: 'Dell XPS 15', type: 'IN', quantity: 10, date: '2026-02-08', user: 'Admin' },
    { id: 2, item: 'Samsung 27" Monitor', type: 'OUT', quantity: 5, date: '2026-02-07', user: 'Manager' },
  ]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom fontWeight="bold">Stock Management</Typography>

      <Grid container spacing={3}>
        {/* Action Panel */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth" sx={{ mb: 3 }}>
              <Tab icon={<AddCircle />} label="Stock In" />
              <Tab icon={<RemoveCircle />} label="Stock Out" />
            </Tabs>

            <Box component="form" noValidate autoComplete="off">
              <TextField fullWidth label="Product Name / SKU" variant="outlined" sx={{ mb: 2 }} />
              <TextField fullWidth label="Quantity" type="number" variant="outlined" sx={{ mb: 2 }} />
              <TextField fullWidth label="Notes / Reference" variant="outlined" sx={{ mb: 2 }} />
              
              <Button 
                variant="contained" 
                fullWidth 
                size="large"
                color={tabValue === 0 ? 'primary' : 'error'}
                startIcon={tabValue === 0 ? <AddCircle /> : <RemoveCircle />}
              >
                {tabValue === 0 ? 'Add to Inventory' : 'Remove from Inventory'}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Recent Movements Log */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
              <History /> Recent Movements
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Item</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Qty</TableCell>
                    <TableCell>User</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {movements.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.item}</TableCell>
                      <TableCell>
                        <Chip 
                          label={row.type} 
                          color={row.type === 'IN' ? 'success' : 'error'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>{row.quantity}</TableCell>
                      <TableCell>{row.user}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StockManagement;