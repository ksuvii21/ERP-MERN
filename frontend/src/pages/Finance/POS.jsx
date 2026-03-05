import React, { useState } from 'react';
import { Box, Grid, Paper, Typography, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Divider, Card, CardContent, CardActionArea, MenuItem, Select, InputAdornment, Tooltip } from '@mui/material';
import { Add, Remove, Delete, Print, ShoppingCartCheckout, Search, QrCodeScanner, WhatsApp, Comment, Business, ReceiptLong, LocalShipping } from '@mui/icons-material';

const POS = () => {
  const [products] = useState([
    { id: 1, name: 'Dell XPS 15', price: 1500, gst: 18, barcode: '1001' },
    { id: 2, name: 'Logitech MX Master', price: 100, gst: 18, barcode: '1002' },
    { id: 3, name: 'Samsung 27" Monitor', price: 350, gst: 18, barcode: '1003' },
    { id: 4, name: 'Ergo Chair', price: 500, gst: 12, barcode: '1004' },
    { id: 5, name: 'USB-C Hub', price: 45, gst: 18, barcode: '1005' },
    { id: 6, name: 'Mechanical Keyboard', price: 120, gst: 18, barcode: '1006' },
  ]);

  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [barcode, setBarcode] = useState('');
  const [company, setCompany] = useState('Head Office');
  const [printCount, setPrintCount] = useState(0);
  
  // GST & E-Invoicing State
  const [customerState, setCustomerState] = useState('Local'); // Local = CGST+SGST, Interstate = IGST
  const [irn, setIrn] = useState(null);
  const [ewayBill, setEwayBill] = useState(null);

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const handleBarcodeScan = (e) => {
    if (e.key === 'Enter') {
        const product = products.find(p => p.barcode === barcode);
        if (product) addToCart(product);
        else alert('Product not found!');
        setBarcode('');
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

  const updateRemark = (id, remark) => {
    setCart(cart.map(item => item.id === id ? { ...item, remark } : item));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const totalGST = cart.reduce((acc, item) => acc + ((item.price * item.gst / 100) * item.qty), 0);
    
    // GST Logic: Split if Local, Single if Interstate
    const taxBreakdown = customerState === 'Local' ? { cgst: totalGST / 2, sgst: totalGST / 2, igst: 0 } : { cgst: 0, sgst: 0, igst: totalGST };
    
    return { subtotal, totalGST, grandTotal: subtotal + totalGST, taxBreakdown };
  };

  const { subtotal, totalGST, grandTotal, taxBreakdown } = calculateTotal();

  const handleWhatsApp = () => {
    const message = `Invoice from ${company}: Total Amount $${grandTotal.toFixed(2)}. Thank you!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handlePrint = () => {
    setPrintCount(prev => prev + 1);
    window.print();
  };

  const generateEInvoice = () => {
    // Simulate API Call
    setIrn(`IRN-${Math.floor(Math.random() * 1000000000)}`);
  };

  const generateEWayBill = () => {
    // Simulate API Call
    setEwayBill(`EWB-${Math.floor(Math.random() * 1000000000)}`);
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <Box p={3} height="100vh" display="flex" flexDirection="column">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" fontWeight="bold">Point of Sale (POS)</Typography>
        <Box display="flex" gap={2} alignItems="center">
            <Select size="small" value={customerState} onChange={(e) => setCustomerState(e.target.value)}>
                <MenuItem value="Local">Local (CGST+SGST)</MenuItem>
                <MenuItem value="Interstate">Interstate (IGST)</MenuItem>
            </Select>
            <Select size="small" value={company} onChange={(e) => setCompany(e.target.value)} startAdornment={<InputAdornment position="start"><Business /></InputAdornment>}>
                <MenuItem value="Head Office">Head Office</MenuItem>
                <MenuItem value="Branch A">Branch A (North)</MenuItem>
                <MenuItem value="Branch B">Branch B (South)</MenuItem>
            </Select>
        </Box>
      </Box>
      
      <Grid container spacing={3} sx={{ flex: 1, overflow: 'hidden' }}>
        {/* Product Catalog */}
        <Grid item xs={12} md={7} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Paper sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField 
                size="small" 
                placeholder="Scan Barcode..." 
                value={barcode} 
                onChange={(e) => setBarcode(e.target.value)} 
                onKeyPress={handleBarcodeScan}
                InputProps={{ startAdornment: <InputAdornment position="start"><QrCodeScanner /></InputAdornment> }}
                autoFocus
            />
            <Divider orientation="vertical" flexItem />
            <Box flex={1} display="flex" alignItems="center">
                <Search sx={{ mr: 1, color: 'text.secondary' }} />
                <TextField fullWidth placeholder="Search Products..." variant="standard" value={search} onChange={(e) => setSearch(e.target.value)} />
            </Box>
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
          <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2, position: 'relative' }}>
            {printCount > 0 && (
                <Typography 
                    variant="h2" 
                    sx={{ 
                        position: 'absolute', top: '40%', left: '10%', transform: 'rotate(-45deg)', 
                        opacity: 0.1, color: 'red', fontWeight: 'bold', pointerEvents: 'none', zIndex: 0 
                    }}
                >
                    DUPLICATE COPY
                </Typography>
            )}
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
                        <TextField 
                            placeholder="Remark..." 
                            variant="standard" 
                            size="small" 
                            value={item.remark || ''} 
                            onChange={(e) => updateRemark(item.id, e.target.value)}
                            InputProps={{ style: { fontSize: 12 } }}
                        />
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
            
            {customerState === 'Local' ? (
                <>
                    <Box display="flex" justifyContent="space-between" mb={1}><Typography color="text.secondary">CGST (9%):</Typography><Typography color="text.secondary">${taxBreakdown.cgst.toFixed(2)}</Typography></Box>
                    <Box display="flex" justifyContent="space-between" mb={1}><Typography color="text.secondary">SGST (9%):</Typography><Typography color="text.secondary">${taxBreakdown.sgst.toFixed(2)}</Typography></Box>
                </>
            ) : (
                <Box display="flex" justifyContent="space-between" mb={1}><Typography color="text.secondary">IGST (18%):</Typography><Typography color="text.secondary">${taxBreakdown.igst.toFixed(2)}</Typography></Box>
            )}
            
            <Box display="flex" justifyContent="space-between" mb={3}><Typography variant="h5" fontWeight="bold">Grand Total:</Typography><Typography variant="h5" fontWeight="bold" color="primary">${grandTotal.toFixed(2)}</Typography></Box>
            
            {/* E-Invoicing & Compliance Actions */}
            <Box display="flex" gap={1} mb={2}>
                <Button variant="outlined" size="small" fullWidth startIcon={<ReceiptLong />} onClick={generateEInvoice} disabled={!!irn}>
                    {irn ? 'IRN Generated' : 'E-Invoice'}
                </Button>
                <Button variant="outlined" size="small" fullWidth startIcon={<LocalShipping />} onClick={generateEWayBill} disabled={!!ewayBill}>
                    {ewayBill ? 'E-Way Bill Generated' : 'E-Way Bill'}
                </Button>
            </Box>
            {irn && <Typography variant="caption" display="block" align="center" color="success.main">IRN: {irn}</Typography>}

            <Box display="flex" gap={1}>
                <Button variant="outlined" color="success" fullWidth startIcon={<WhatsApp />} onClick={handleWhatsApp}>WhatsApp</Button>
                <Button variant="contained" fullWidth startIcon={<Print />} onClick={handlePrint} disabled={cart.length === 0}>Print {printCount > 0 ? `(${printCount})` : ''}</Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default POS;