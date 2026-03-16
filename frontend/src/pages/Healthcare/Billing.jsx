import React, { useState, useEffect, useMemo } from 'react';
import {
  Container, Typography, Box, Paper, CircularProgress, Grid, List, ListItemButton,
  ListItemText, Collapse, Chip, Divider, Button
} from '@mui/material';
import { ExpandLess, ExpandMore, ReceiptLong, Category, Payments, AssuredWorkload, TextField } from '@mui/icons-material';
import api from '../../utils/api';

// --- Helper function to group invoice items ---
const groupItemsByCategory = (items) => {
  if (!items) return {};
  return items.reduce((acc, item) => {
    const category = item.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});
};

// --- The Collapsible Itemized Invoice Component ---
const CollapsibleItemizedInvoice = ({ invoice, onRecordPayment }) => {
  const [openCategories, setOpenCategories] = useState({});
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const groupedItems = groupItemsByCategory(invoice.items);

  const handleCategoryClick = (category) => {
    setOpenCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  if (!invoice) {
    return (
      <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', borderRadius: '16px', border: '2px dashed #e2e8f0' }}>
        <ReceiptLong sx={{ fontSize: 48, color: '#cbd5e1', mb: 2 }} />
        <Typography color="text.secondary">Select an invoice to view details</Typography>
      </Paper>
    );
  }

  // Fix: Define taxAmount and grandTotal
  const taxAmount = invoice.totalAmount * 0.05;
  const grandTotal = invoice.totalAmount + taxAmount;

  return (
    <Paper sx={{ p: 3, borderRadius: '16px', border: '1px solid #e2e8f0' }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight="700">Invoice #{invoice._id.substring(18).toUpperCase()}</Typography>
          <Typography variant="body2" color="text.secondary">
            Patient: {invoice.customerName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Issued: {new Date(invoice.invoiceDate).toLocaleDateString()}
          </Typography>
        </Box>
        <Chip label={invoice.status} color={invoice.status === 'Paid' ? 'success' : 'warning'} />
      </Box>

      {/* Smart Itemization */}
      <Typography variant="h6" fontWeight="600" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Category fontSize="small" /> Itemized Charges
      </Typography>
      <List component="nav" dense>
        {Object.entries(groupedItems).map(([category, items]) => (
          <React.Fragment key={category}>
            <ListItemButton onClick={() => handleCategoryClick(category)}>
              <ListItemText primary={<Typography fontWeight="600">{category}</Typography>} />
              {openCategories[category] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openCategories[category]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {items.map((item, index) => (
                  <ListItemText
                    key={index}
                    sx={{ pl: 4, display: 'flex', justifyContent: 'space-between' }}
                    primary={item.description}
                    secondary={`Qty: ${item.quantity} @ $${item.price.toFixed(2)}`}
                    primaryTypographyProps={{ style: { flexGrow: 1 } }}
                    secondaryTypographyProps={{ style: { textAlign: 'right' } }}
                  />
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        ))}
      </List>

      <Divider sx={{ mb: 4 }} />

      {/* Financial Summary & Split-Bill Logic */}
      <Grid container spacing={4}>
        {/* Left Side: Totals */}
        <Grid item xs={12} md={6}>
          <Stack spacing={1}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">Subtotal</Typography>
              <Typography variant="body2" fontWeight="600">${invoice.totalAmount.toFixed(2)}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Box display="flex" alignItems="center" gap={0.5}>
                <Typography variant="body2" color="text.secondary">Taxes (GST 5%)</Typography>
                <Tooltip title="Standard healthcare GST applies"><Info sx={{ fontSize: 14, color: '#94a3b8' }} /></Tooltip>
              </Box>
              <Typography variant="body2" fontWeight="600">${taxAmount.toFixed(2)}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" pt={1}>
              <Typography variant="h6" fontWeight="900">Grand Total</Typography>
              <Typography variant="h6" fontWeight="900" color="primary">${grandTotal.toFixed(2)}</Typography>
            </Box>
          </Stack>
        </Grid>

        {/* Right Side: Split Logic */}
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '16px' }}>
            <Typography variant="caption" fontWeight="800" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <AssuredWorkload sx={{ fontSize: 16 }} /> BILL SETTLEMENT SPLIT
            </Typography>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2">Insurance Approved</Typography>
              <Typography variant="body2" fontWeight="700" color="primary">${invoice.insurancePayable?.toFixed(2) || '0.00'}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2">Patient Co-pay</Typography>
              <Typography variant="body2" fontWeight="900" color="#e11d48">${invoice.patientPayable?.toFixed(2) || grandTotal.toFixed(2)}</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Footer Actions */}
      <Box mt={5} display="flex" justifyContent="flex-end" gap={2}>
        <Button variant="outlined" sx={{ borderRadius: '10px', textTransform: 'none' }}>Download PDF</Button>
        <Button 
          variant="contained"
          disabled={invoice.status === 'Paid'}
          onClick={() => setIsPayModalOpen(true)}
          sx={{ borderRadius: '10px', px: 4, textTransform: 'none', fontWeight: 700, bgcolor: '#0f172a' }}
        >
          {invoice.status === 'Paid' ? 'Invoice Settled' : 'Collect Payment'}
        </Button>
      </Box>

      {/* Payment Modal */}
      <Dialog open={isPayModalOpen} onClose={() => setIsPayModalOpen(false)} PaperProps={{ sx: { borderRadius: '20px', width: 400 } }}>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 900 }}>Secure Checkout</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center" gap={2} py={2}>
            <Typography variant="h4" fontWeight="900" color="primary">${invoice.patientPayable?.toFixed(2)}</Typography>
            <Typography variant="caption" color="textSecondary">Payable by Patient</Typography>
            
            <Box sx={{ p: 2, border: '1px solid #e2e8f0', borderRadius: '12px', textAlign: 'center', width: '100%' }}>
              <QrCode2 sx={{ fontSize: 80, color: '#334155' }} />
              <Typography variant="caption" display="block">Scan for UPI Payment</Typography>
            </Box>
            
            <Button fullWidth variant="outlined" startIcon={<CreditCard />}>Pay with Card</Button>
            <Button fullWidth variant="contained" color="success" onClick={() => { onRecordPayment(invoice._id); setIsPayModalOpen(false); }}>
              Confirm Cash Payment
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Paper>
  );
};

// --- Main Billing Page ---
const Billing = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/billing/invoices');
      setInvoices(data);
      if (data.length > 0) {
        setSelectedInvoice(data[0]);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleRecordPayment = async (id) => {
    try {
      // This should be a more complex endpoint in a real app, taking amount and method
      await api.put(`/billing/invoices/${id}/pay`); 
      setInvoices(prev => prev.map(inv => inv._id === id ? { ...inv, status: 'Paid' } : inv));
      setSelectedInvoice(prev => (prev && prev._id === id ? { ...prev, status: 'Paid' } : prev));
    } catch (err) { alert("Payment Recording Failed"); }
  };

  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const matchesSearch = inv.customerName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'All' || inv.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchTerm, filterStatus]);

  return (
    <Container maxWidth="xl" sx={{ py: 4, bgcolor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" fontWeight="900" color="#0f172a" sx={{ letterSpacing: '-1.5px' }}>Financial Center</Typography>
          <Typography color="textSecondary">Hospital revenue & patient invoicing</Typography>
        </Box>
        <TextField 
          placeholder="Search by patient name..." 
          size="small" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ bgcolor: 'white', borderRadius: '12px', width: 300, '& fieldset': { border: 'none' }, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
          InputProps={{ startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} /> }}
        />
      </Box>

      <Paper elevation={0} sx={{ p: 1, mb: 3, borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <ToggleButtonGroup
          value={filterStatus}
          exclusive
          onChange={(e, newStatus) => { if (newStatus) setFilterStatus(newStatus); }}
          aria-label="invoice status filter"
        >
          <ToggleButton value="All" aria-label="all">All</ToggleButton>
          <ToggleButton value="Draft" aria-label="draft">Draft</ToggleButton>
          <ToggleButton value="Open" aria-label="open">Open</ToggleButton>
          <ToggleButton value="Partial" aria-label="partial">Partial</ToggleButton>
          <ToggleButton value="Paid" aria-label="paid">Paid</ToggleButton>
        </ToggleButtonGroup>
      </Paper>

      {loading ? <CircularProgress sx={{ m: 'auto' }} /> : (
        <Grid container spacing={3} sx={{ flex: 1, minHeight: 0 }}>
          {/* Left Panel: Invoice List */}
          <Grid item xs={12} md={4} sx={{ height: '100%', overflowY: 'auto' }}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: '24px', border: '1px solid #e2e8f0', height: '100%' }}>
              <List>
                {filteredInvoices.map(inv => (
                  <ListItemButton
                    key={inv._id}
                    selected={selectedInvoice?._id === inv._id}
                    onClick={() => setSelectedInvoice(inv)}
                    sx={{ borderRadius: '16px', mb: 1.5, p: 2, transition: '0.2s', '&.Mui-selected': { bgcolor: '#eff6ff', border: '1px solid #3b82f6' } }}
                  >
                    <ListItemText
                      primary={<Typography fontWeight="800" color="#1e293b">{inv.customerName}</Typography>}
                      secondary={`ID: ${inv._id.slice(-6).toUpperCase()} • ${inv.status}`}
                    />
                    <Typography fontWeight="900" color="#334155">${inv.totalAmount.toFixed(2)}</Typography>
                  </ListItemButton>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Right Panel: Invoice Detail */}
          <Grid item xs={12} md={8}>
            <CollapsibleItemizedInvoice 
              invoice={selectedInvoice} 
              onRecordPayment={handleRecordPayment} 
            />
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Billing;