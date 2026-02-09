import React, { useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Rating, Chip, Button, LinearProgress } from '@mui/material';
import { LocalShipping, Star } from '@mui/icons-material';

const SupplierManagement = () => {
  // Mock Data with AI Scores
  const [suppliers] = useState([
    { id: 1, name: 'TechGlobal Distributors', contact: 'alice@techglobal.com', category: 'Electronics', aiScore: 92, deliverySpeed: 'Fast', quality: 'High' },
    { id: 2, name: 'Office Supplies Co.', contact: 'bob@officesupplies.com', category: 'Stationery', aiScore: 78, deliverySpeed: 'Average', quality: 'Medium' },
    { id: 3, name: 'MegaParts Ltd.', contact: 'support@megaparts.com', category: 'Hardware', aiScore: 45, deliverySpeed: 'Slow', quality: 'Low' },
  ]);

  const getScoreColor = (score) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'primary';
    if (score >= 50) return 'warning';
    return 'error';
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SupplierManagement;