import React, { useState } from 'react';
import { Box, Grid, Paper, Typography, Switch, FormControlLabel, TextField, Button, Divider, Slider, IconButton, Select, MenuItem, Chip } from '@mui/material';
import { Save, PictureAsPdf, ColorLens, FormatShapes, ArrowUpward, ArrowDownward, DragIndicator, Language } from '@mui/icons-material';

const InvoiceDesign = () => {
  const [config, setConfig] = useState({
    showLogo: true,
    showGSTIN: true,
    showTerms: true,
    showWatermark: false,
    primaryColor: '#3b82f6',
    fontSize: 14,
    headerText: 'Tax Invoice',
    footerText: 'Thank you for your business!',
    language: 'en',
    columns: { hsn: true, batch: false, serial: false },
  });

  const [sections, setSections] = useState(['Header', 'BillTo', 'Items', 'Totals', 'Footer']);

  const labels = {
    en: { title: 'TAX INVOICE', billTo: 'Bill To', item: 'Item', qty: 'Qty', price: 'Price', total: 'Total', terms: 'Terms & Conditions' },
    hi: { title: 'टैक्स चालान', billTo: 'प्रति', item: 'वस्तु', qty: 'मात्रा', price: 'मूल्य', total: 'कुल', terms: 'नियम और शर्तें' },
    es: { title: 'FACTURA FISCAL', billTo: 'Cobrar a', item: 'Artículo', qty: 'Cant.', price: 'Precio', total: 'Total', terms: 'Términos y condiciones' }
  };

  const currentLabels = labels[config.language];

  const handleChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const toggleColumn = (col) => {
    setConfig(prev => ({ ...prev, columns: { ...prev.columns, [col]: !prev.columns[col] } }));
  };

  const moveSection = (index, direction) => {
    const newSections = [...sections];
    if (direction === 'up' && index > 0) {
      [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
    } else if (direction === 'down' && index < sections.length - 1) {
      [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
    }
    setSections(newSections);
  };

  const renderSection = (section) => {
    switch(section) {
        case 'Header': return renderHeader();
        case 'BillTo': return renderBillTo();
        case 'Items': return renderItems();
        case 'Totals': return renderTotals();
        case 'Footer': return renderFooter();
        default: return null;
    }
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">Invoice Template Designer</Typography>
        <Box>
            <Button variant="outlined" startIcon={<PictureAsPdf />} sx={{ mr: 2 }}>Preview PDF</Button>
            <Button variant="contained" startIcon={<Save />}>Save Template</Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Controls Panel */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                <FormatShapes /> Template Configuration
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Typography variant="subtitle2" gutterBottom>Visibility</Typography>
            <FormControlLabel control={<Switch checked={config.showLogo} onChange={(e) => handleChange('showLogo', e.target.checked)} />} label="Show Company Logo" />
            <FormControlLabel control={<Switch checked={config.showGSTIN} onChange={(e) => handleChange('showGSTIN', e.target.checked)} />} label="Show GSTIN/Tax ID" />
            <FormControlLabel control={<Switch checked={config.showTerms} onChange={(e) => handleChange('showTerms', e.target.checked)} />} label="Show Terms & Conditions" />
            <FormControlLabel control={<Switch checked={config.showWatermark} onChange={(e) => handleChange('showWatermark', e.target.checked)} />} label="Background Watermark" />
            
            <Box mt={2}>
                <Typography variant="subtitle2" gutterBottom>Custom Columns</Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                    <Chip label="HSN Code" onClick={() => toggleColumn('hsn')} color={config.columns.hsn ? "primary" : "default"} variant={config.columns.hsn ? "filled" : "outlined"} />
                    <Chip label="Batch No" onClick={() => toggleColumn('batch')} color={config.columns.batch ? "primary" : "default"} variant={config.columns.batch ? "filled" : "outlined"} />
                    <Chip label="Serial No" onClick={() => toggleColumn('serial')} color={config.columns.serial ? "primary" : "default"} variant={config.columns.serial ? "filled" : "outlined"} />
                </Box>
            </Box>

            <Divider sx={{ my: 2 }} />
            
            <Box mt={3}>
                <Typography gutterBottom display="flex" alignItems="center" gap={1}><ColorLens fontSize="small"/> Primary Color</Typography>
                <input type="color" value={config.primaryColor} onChange={(e) => handleChange('primaryColor', e.target.value)} style={{ width: '100%', height: 40, cursor: 'pointer' }} />
            </Box>

            <Box mt={3}>
                <Typography gutterBottom>Font Size ({config.fontSize}px)</Typography>
                <Slider value={config.fontSize} min={10} max={24} onChange={(e, v) => handleChange('fontSize', v)} />
            </Box>

            <Box mt={3}>
                <Typography gutterBottom display="flex" alignItems="center" gap={1}><Language fontSize="small"/> Language</Typography>
                <Select fullWidth size="small" value={config.language} onChange={(e) => handleChange('language', e.target.value)}>
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="hi">Hindi (हिंदी)</MenuItem>
                    <MenuItem value="es">Spanish (Español)</MenuItem>
                </Select>
            </Box>

            <Box mt={3}>
                <TextField fullWidth label="Custom Header Title" value={config.headerText} onChange={(e) => handleChange('headerText', e.target.value)} margin="normal" />
                <TextField fullWidth label="Footer Message" value={config.footerText} onChange={(e) => handleChange('footerText', e.target.value)} margin="normal" />
            </Box>

            <Box mt={3}>
                <Typography variant="subtitle2" gutterBottom>Section Ordering (Drag & Drop Sim)</Typography>
                {sections.map((sec, idx) => (
                    <Box key={sec} display="flex" alignItems="center" justifyContent="space-between" p={1} mb={1} bgcolor="#f8fafc" borderRadius={1} border="1px solid #e2e8f0">
                        <Box display="flex" alignItems="center" gap={1}>
                            <DragIndicator fontSize="small" color="disabled" />
                            <Typography variant="body2">{sec}</Typography>
                        </Box>
                        <Box>
                            <IconButton size="small" onClick={() => moveSection(idx, 'up')} disabled={idx === 0}><ArrowUpward fontSize="small" /></IconButton>
                            <IconButton size="small" onClick={() => moveSection(idx, 'down')} disabled={idx === sections.length - 1}><ArrowDownward fontSize="small" /></IconButton>
                        </Box>
                    </Box>
                ))}
            </Box>
          </Paper>
        </Grid>

        {/* Live Preview Panel */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4, minHeight: 800, border: '1px solid #e2e8f0', position: 'relative', fontFamily: 'Arial, sans-serif' }}>
            {sections.map(section => (
                <Box key={section} mb={3}>
                    {renderSection(section)}
                </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );

  function renderHeader() {
    return (
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" sx={{ borderBottom: `2px solid ${config.primaryColor}`, pb: 2 }}>
            <Box>
                {config.showLogo && <Box sx={{ width: 50, height: 50, bgcolor: config.primaryColor, borderRadius: 1, mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>LOGO</Box>}
                <Typography variant="h5" fontWeight="bold" style={{ color: config.primaryColor }}>My Company Ltd.</Typography>
                <Typography variant="body2">123 Business Park, Tech City</Typography>
                {config.showGSTIN && <Typography variant="body2">GSTIN: 27ABCDE1234F1Z5</Typography>}
            </Box>
            <Box textAlign="right">
                <Typography variant="h4" fontWeight="bold" color="text.secondary">{config.headerText || currentLabels.title}</Typography>
                <Typography variant="body1">#INV-2026-001</Typography>
                <Typography variant="body2">Date: {new Date().toLocaleDateString()}</Typography>
            </Box>
        </Box>
    );
  }

  function renderBillTo() {
    return (
        <Box>
            <Typography variant="subtitle2" color="text.secondary">{currentLabels.billTo}:</Typography>
            <Typography fontWeight="bold">Client Name</Typography>
            <Typography variant="body2">Client Address Line 1</Typography>
        </Box>
    );
  }

  function renderItems() {
    return (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: `${config.fontSize}px` }}>
            <thead>
                <tr style={{ backgroundColor: config.primaryColor, color: 'white' }}>
                    <th style={{ padding: '10px', textAlign: 'left' }}>{currentLabels.item}</th>
                    {config.columns.hsn && <th style={{ padding: '10px', textAlign: 'left' }}>HSN</th>}
                    {config.columns.batch && <th style={{ padding: '10px', textAlign: 'left' }}>Batch</th>}
                    <th style={{ padding: '10px', textAlign: 'right' }}>{currentLabels.qty}</th>
                    <th style={{ padding: '10px', textAlign: 'right' }}>{currentLabels.price}</th>
                    <th style={{ padding: '10px', textAlign: 'right' }}>{currentLabels.total}</th>
                </tr>
            </thead>
            <tbody>
                {[1, 2, 3].map(i => (
                    <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '10px' }}>Sample Product {i}</td>
                        {config.columns.hsn && <td style={{ padding: '10px' }}>8471</td>}
                        {config.columns.batch && <td style={{ padding: '10px' }}>B-00{i}</td>}
                        <td style={{ padding: '10px', textAlign: 'right' }}>1</td>
                        <td style={{ padding: '10px', textAlign: 'right' }}>$100.00</td>
                        <td style={{ padding: '10px', textAlign: 'right' }}>$100.00</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
  }

  function renderTotals() {
    return (
        <Box textAlign="right">
            <Typography variant="h6">{currentLabels.total}: $300.00</Typography>
        </Box>
    );
  }

  function renderFooter() {
    return (
        <Box>
            {config.showTerms && <Box pt={2} borderTop="1px solid #eee"><Typography variant="caption" color="text.secondary"><strong>{currentLabels.terms}:</strong> Payment due within 30 days.</Typography></Box>}
            <Box mt={2} textAlign="center"><Typography variant="body2" fontStyle="italic">{config.footerText}</Typography></Box>
        </Box>
    );
  }
};

export default InvoiceDesign;