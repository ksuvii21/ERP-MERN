import React, { useState } from 'react';
import { Box, Grid, Paper, Typography, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Divider, Card, CardContent, CardActionArea } from '@mui/material';
import { Add, Remove, Delete, Print, ShoppingCartCheckout, Search } from '@mui/icons-material';

const POS = () => {
  const [products] = useState([
    { id: 1, name: 'Dell XPS 15', price: 1500, gst: 18 },
    { id: 2, name: 'Logitech MX Master', price: 100, gst: 18 },
    { id: 3, name: 'Samsung 27" Monitor', price: 350, gst: 18 },
    { id: 4, name: 'Ergo Chair', price: 500, gst: 12 },
    { id: 5, name: 'USB-C Hub', price: 45, gst: 18 },
    { id: 6, name: 'Mechanical Keyboard', price: 120, gst: 18 },
  ]);

  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const updateQty = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const totalGST = cart.reduce((acc, item) => acc + ((item.price * item.gst / 100) * item.qty), 0);
    return { subtotal, totalGST, grandTotal: subtotal + totalGST };
  };

  const { subtotal, totalGST, grandTotal } = calculateTotal();

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <Box p={3} height="100vh" display="flex" flexDirection="column">
      <Typography variant="h4" fontWeight="bold" gutterBottom>Point of Sale (POS)</Typography>
      
      <Grid container spacing={3} sx={{ flex: 1, overflow: 'hidden' }}>
        {/* Product Catalog */}
        <Grid item xs={12} md={7} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Paper sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center' }}>
            <Search sx={{ mr: 1, color: 'text.secondary' }} />
            <TextField fullWidth placeholder="Search Products..." variant="standard" value={search} onChange={(e) => setSearch(e.target.value)} />
          </Paper>
          <Box sx={{ overflowY: 'auto', flex: 1 }}>
            <Grid container spacing={2}>
              {filteredProducts.map(product => (
                <Grid item xs={12} sm={4} key={product.id}>
                  <Card sx={{ height: '100%' }}>
                    <CardActionArea onClick={() => addToCart(product)} sx={{ height: '100%', p: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <Typography variant="h6">{product.name}</Typography>
                      <Box mt={2}>
                        <Typography variant="h5" color="primary">${product.price}</Typography>
                        <Typography variant="caption" color="text.secondary">GST: {product.gst}%</Typography>
                      </Box>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>

        {/* Billing Cart */}
        <Grid item xs={12} md={5} sx={{ height: '100%' }}>
          <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
            <Typography variant="h6" gutterBottom>Current Bill</Typography>
            <TableContainer sx={{ flex: 1 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell align="center">Qty</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cart.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">{item.name}</Typography>
                        <Typography variant="caption" color="text.secondary">GST {item.gst}%</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box display="flex" alignItems="center" justifyContent="center">
                          <IconButton size="small" onClick={() => updateQty(item.id, -1)}><Remove fontSize="small" /></IconButton>
                          <Typography sx={{ mx: 1 }}>{item.qty}</Typography>
                          <IconButton size="small" onClick={() => updateQty(item.id, 1)}><Add fontSize="small" /></IconButton>
                        </Box>
                      </TableCell>
                      <TableCell align="right">${(item.price * item.qty).toFixed(2)}</TableCell>
                      <TableCell align="center">
                        <IconButton size="small" color="error" onClick={() => removeFromCart(item.id)}><Delete fontSize="small" /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between" mb={1}><Typography>Subtotal:</Typography><Typography>${subtotal.toFixed(2)}</Typography></Box>
            <Box display="flex" justifyContent="space-between" mb={2}><Typography>Total GST:</Typography><Typography>${totalGST.toFixed(2)}</Typography></Box>
            <Box display="flex" justifyContent="space-between" mb={3}><Typography variant="h5" fontWeight="bold">Grand Total:</Typography><Typography variant="h5" fontWeight="bold" color="primary">${grandTotal.toFixed(2)}</Typography></Box>
            <Button variant="contained" fullWidth size="large" startIcon={<ShoppingCartCheckout />} disabled={cart.length === 0}>Checkout & Print</Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default POS;