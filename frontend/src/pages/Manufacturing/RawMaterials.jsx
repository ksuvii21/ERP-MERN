import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';
import api from '../../utils/api';

const RawMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRawMaterials = async () => {
      try {
        setLoading(true);
        setError('');
        // This assumes your API can filter products by a 'productType' field.
        // If not, you might need to adjust the backend or filter on the client side.
        const res = await api.get('/products?productType=raw_material');
        setMaterials(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch raw materials.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRawMaterials();
  }, []);

  if (loading) return <Container><CircularProgress /></Container>;

  return (
    <Container>
      <Box mb={4}>
        <Typography variant="h4" component="h1">Raw Materials Inventory</Typography>
        <Typography variant="body2" color="text.secondary">
          List of all products designated as raw materials or components.
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead><TableRow><TableCell>Material Name</TableCell><TableCell>SKU</TableCell><TableCell>Category</TableCell><TableCell align="right">Stock on Hand</TableCell></TableRow></TableHead>
          <TableBody>
            {materials.map((material) => (
              <TableRow key={material._id} hover>
                <TableCell>{material.name}</TableCell><TableCell>{material.sku || 'N/A'}</TableCell><TableCell>{material.category?.name || 'N/A'}</TableCell><TableCell align="right">{material.quantity || 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default RawMaterials;