import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import API from '../utils/api';

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const { data } = await API.get('/purchases');
        setPurchases(data);
      } catch (error) {
        console.error('Failed to fetch purchases', error);
      }
    };
    fetchPurchases();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Purchase Orders</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Total Cost</TableCell>
              <TableCell>Vendor</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {purchases.map((purchase) => (
              <TableRow key={purchase._id}>
                <TableCell>{new Date(purchase.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>${purchase.totalAmount}</TableCell>
                <TableCell>{purchase.vendor || 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Purchases;