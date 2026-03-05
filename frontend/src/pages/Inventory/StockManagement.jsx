import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tab, Tabs, Chip, MenuItem } from '@mui/material';
import { AddCircle, RemoveCircle, History, SwapHoriz } from '@mui/icons-material';

const StockManagement = () => {
  const [tabValue, setTabValue] = useState(0);
  const [movements, setMovements] = useState([
    { id: 1, item: 'Dell XPS 15', type: 'IN', quantity: 10, date: '2026-02-08', user: 'Admin', location: 'Main Warehouse' },
    { id: 2, item: 'Samsung 27" Monitor', type: 'OUT', quantity: 5, date: '2026-02-07', user: 'Manager', location: 'Store A' },
    { id: 3, item: 'Logitech MX Master', type: 'TRANSFER', quantity: 20, date: '2026-02-09', user: 'Admin', location: 'Main -> Store B' },
  ]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom fontWeight="bold">Stock Management</Typography>

      <Grid container spacing={3}>
        {/* Action Panel */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth" sx={{ mb: 3 }}>
              <Tab icon={<AddCircle />} label="Stock In" />
              <Tab icon={<RemoveCircle />} label="Stock Out" />
              <Tab icon={<SwapHoriz />} label="Transfer" />
            </Tabs>

            <Box component="form" noValidate autoComplete="off">
              <TextField fullWidth label="Product Name / SKU" variant="outlined" sx={{ mb: 2 }} />
              <TextField fullWidth label="Quantity" type="number" variant="outlined" sx={{ mb: 2 }} />
              
              {tabValue !== 2 && (
                <TextField select fullWidth label="Location / Warehouse" variant="outlined" sx={{ mb: 2 }} defaultValue="Main Warehouse">
                    <MenuItem value="Main Warehouse">Main Warehouse</MenuItem>
                    <MenuItem value="Store A">Store A</MenuItem>
                    <MenuItem value="Store B">Store B</MenuItem>
                </TextField>
              )}

              {tabValue === 2 && (
                <Box display="flex" gap={2} mb={2}>
                    <TextField select fullWidth label="From" defaultValue="Main Warehouse">
                        <MenuItem value="Main Warehouse">Main Warehouse</MenuItem>
                        <MenuItem value="Store A">Store A</MenuItem>
                    </TextField>
                    <TextField select fullWidth label="To" defaultValue="Store B">
                        <MenuItem value="Store B">Store B</MenuItem>
                        <MenuItem value="Godown C">Godown C</MenuItem>
                    </TextField>
                </Box>
              )}

              <TextField fullWidth label="Notes / Reference" variant="outlined" sx={{ mb: 2 }} />
              
              <Button 
                variant="contained" 
                fullWidth 
                size="large"
                color={tabValue === 0 ? 'primary' : tabValue === 1 ? 'error' : 'warning'}
                startIcon={tabValue === 0 ? <AddCircle /> : tabValue === 1 ? <RemoveCircle /> : <SwapHoriz />}
              >
                {tabValue === 0 ? 'Add to Inventory' : tabValue === 1 ? 'Remove from Inventory' : 'Transfer Stock'}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Recent Movements Log */}
        <Grid size={{ xs: 12, md: 7 }}>
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
                    <TableCell>Location</TableCell>
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
                          color={row.type === 'IN' ? 'success' : row.type === 'OUT' ? 'error' : 'warning'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>{row.quantity}</TableCell>
                      <TableCell>{row.location}</TableCell>
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