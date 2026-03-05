import React, { useState } from 'react';
import { Box, Typography, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Tabs, Tab, Chip } from '@mui/material';
import { Download, Description, ReceiptLong, Gavel } from '@mui/icons-material';

const GSTReports = () => {
  const [tabValue, setTabValue] = useState(0);

  const gstr1Data = [
    { id: 'INV-001', date: '2026-02-01', customer: 'Acme Corp', gstin: '27ABCDE1234F1Z5', taxable: 1000, gst: 180, total: 1180 },
    { id: 'INV-002', date: '2026-02-05', customer: 'Globex Inc', gstin: '29XYZAB5678G2Z9', taxable: 2500, gst: 450, total: 2950 },
  ];

  const gstr3bData = [
    { category: 'Outward Supplies (Sales)', taxable: 3500, igst: 450, cgst: 90, sgst: 90, cess: 0 },
    { category: 'Inward Supplies (Purchases)', taxable: 1200, igst: 150, cgst: 30, sgst: 30, cess: 0 },
    { category: 'Net Tax Liability', taxable: 2300, igst: 300, cgst: 60, sgst: 60, cess: 0 },
  ];

  const taxRules = [
    { hsn: '8471', desc: 'Laptops & Computers', rate: 18 },
    { hsn: '8517', desc: 'Telephones & Mobiles', rate: 18 },
    { hsn: '9403', desc: 'Furniture', rate: 12 },
    { hsn: '3004', desc: 'Pharmaceuticals', rate: 12 },
  ];

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ gstr1: gstr1Data, summary: gstr3bData }, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "GST_Return_Feb2026.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">GST Compliance & Reports</Typography>
        <Button variant="outlined" startIcon={<Download />} onClick={handleExportJSON}>Export JSON (Govt Portal)</Button>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} variant="fullWidth">
          <Tab icon={<Description />} label="GSTR-1 (Sales)" />
          <Tab icon={<ReceiptLong />} label="GSTR-3B (Summary)" />
          <Tab icon={<Gavel />} label="Tax Rule Engine" />
        </Tabs>
      </Paper>

      {tabValue === 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>GSTR-1: Outward Supplies</Typography>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell>Invoice Date</TableCell>
                  <TableCell>Invoice No</TableCell>
                  <TableCell>Customer GSTIN</TableCell>
                  <TableCell align="right">Taxable Value</TableCell>
                  <TableCell align="right">GST Amount</TableCell>
                  <TableCell align="right">Total Invoice Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {gstr1Data.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.gstin}</TableCell>
                    <TableCell align="right">${row.taxable}</TableCell>
                    <TableCell align="right">${row.gst}</TableCell>
                    <TableCell align="right">${row.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {tabValue === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>GSTR-3B: Monthly Summary</Typography>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell>Nature of Supplies</TableCell>
                  <TableCell align="right">Taxable Value</TableCell>
                  <TableCell align="right">IGST</TableCell>
                  <TableCell align="right">CGST</TableCell>
                  <TableCell align="right">SGST</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {gstr3bData.map((row, index) => (
                  <TableRow key={index} sx={{ bgcolor: index === 2 ? '#f0f9ff' : 'inherit' }}>
                    <TableCell><strong>{row.category}</strong></TableCell>
                    <TableCell align="right">${row.taxable}</TableCell>
                    <TableCell align="right">${row.igst}</TableCell>
                    <TableCell align="right">${row.cgst}</TableCell>
                    <TableCell align="right">${row.sgst}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {tabValue === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Tax Rate Rules (HSN/SAC)</Typography>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell>HSN Code</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>GST Rate (%)</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {taxRules.map((rule) => (
                  <TableRow key={rule.hsn}>
                    <TableCell>{rule.hsn}</TableCell>
                    <TableCell>{rule.desc}</TableCell>
                    <TableCell>{rule.rate}%</TableCell>
                    <TableCell><Chip label="Active" color="success" size="small" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
};

export default GSTReports;