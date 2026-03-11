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

const ManufacturingProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Fetch products designated as 'finished_good'
        const res = await api.get('/products?productType=finished_good');
        setProducts(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch manufacturable products.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <Container><CircularProgress /></Container>;

  return (
    <Container>
      <Box mb={4}>
        <Typography variant="h4" component="h1">Manufacturable Products</Typography>
        <Typography variant="body2" color="text.secondary">
          List of all products designated as finished goods.
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead><TableRow><TableCell>Product Name</TableCell><TableCell>SKU</TableCell><TableCell>Category</TableCell><TableCell align="right">Current Stock</TableCell></TableRow></TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id} hover>
                <TableCell>{product.name}</TableCell><TableCell>{product.sku || 'N/A'}</TableCell><TableCell>{product.category?.name || 'N/A'}</TableCell><TableCell align="right">{product.quantity || 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ManufacturingProducts;