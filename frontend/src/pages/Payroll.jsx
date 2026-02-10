import React, { useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Grid, TextField, Divider } from '@mui/material';
import { Add, Calculate, Receipt } from '@mui/icons-material';

const Payroll = () => {
  // Mock data
  const [payrolls, setPayrolls] = useState([
    { id: 1, employee: 'Alice Johnson', month: 'January', amount: 4500, status: 'Paid', basic: 3000, hra: 1000, da: 500, ded: 0 },
    { id: 2, employee: 'Bob Smith', month: 'January', amount: 4200, status: 'Pending', basic: 2800, hra: 900, da: 500, ded: 0 },
    { id: 3, employee: 'Charlie Brown', month: 'January', amount: 3800, status: 'Processing', basic: 2500, hra: 800, da: 500, ded: 0 },
  ]);

  const [openCalc, setOpenCalc] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [calcResult, setCalcResult] = useState(null);

  const handleCalculate = () => {
    // Simulate Backend Calculation Engine
    const basic = 5000;
    const hra = basic * 0.4;
    const da = basic * 0.1;
    const gross = basic + hra + da;
    const pf = basic * 0.12;
    const tax = 200;
    const net = gross - pf - tax;

    setCalcResult({ basic, hra, da, gross, pf, tax, net });
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">Payroll Management</Typography>
        <Button variant="contained" startIcon={<Calculate />} onClick={() => setOpenCalc(true)}>Run Salary Engine</Button>
      </Box>
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f8fafc' }}>
            <TableRow>
              <TableCell><strong>Employee</strong></TableCell>
              <TableCell><strong>Month</strong></TableCell>
              <TableCell><strong>Amount</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payrolls.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{row.employee}</TableCell>
                <TableCell>{row.month}</TableCell>
                <TableCell>${row.amount}</TableCell>
                <TableCell>
                  <Chip label={row.status} color={row.status === 'Paid' ? 'success' : row.status === 'Pending' ? 'warning' : 'default'} size="small" />
                </TableCell>
                <TableCell>
                    <Button size="small" startIcon={<Receipt />}>Payslip</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Salary Calculator Modal */}
      <Dialog open={openCalc} onClose={() => setOpenCalc(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Salary Calculator Engine</DialogTitle>
        <DialogContent>
            <Box mb={2} mt={1}>
                <TextField select fullWidth label="Select Employee" SelectProps={{ native: true }} onChange={(e) => setSelectedEmp(e.target.value)}>
                    <option value="">-- Select --</option>
                    <option value="Alice">Alice Johnson</option>
                    <option value="Bob">Bob Smith</option>
                </TextField>
            </Box>
            
            {!calcResult ? (
                <Button variant="contained" fullWidth onClick={handleCalculate}>Calculate Net Salary</Button>
            ) : (
                <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f8fafc' }}>
                    <Typography variant="h6" gutterBottom>Salary Breakdown</Typography>
                    <Grid container spacing={1}>
                        <Grid item xs={6}><Typography color="text.secondary">Basic Pay:</Typography></Grid>
                        <Grid item xs={6} textAlign="right"><Typography>${calcResult.basic}</Typography></Grid>
                        
                        <Grid item xs={6}><Typography color="text.secondary">HRA (40%):</Typography></Grid>
                        <Grid item xs={6} textAlign="right"><Typography>${calcResult.hra}</Typography></Grid>
                        
                        <Grid item xs={6}><Typography color="text.secondary">DA (10%):</Typography></Grid>
                        <Grid item xs={6} textAlign="right"><Typography>${calcResult.da}</Typography></Grid>
                        
                        <Grid item xs={12}><Divider sx={{ my: 1 }} /></Grid>
                        
                        <Grid item xs={6}><Typography fontWeight="bold">Gross Salary:</Typography></Grid>
                        <Grid item xs={6} textAlign="right"><Typography fontWeight="bold">${calcResult.gross}</Typography></Grid>
                        
                        <Grid item xs={6}><Typography color="error">Deductions (PF+Tax):</Typography></Grid>
                        <Grid item xs={6} textAlign="right"><Typography color="error">-${(calcResult.pf + calcResult.tax)}</Typography></Grid>
                        
                        <Grid item xs={12}><Divider sx={{ my: 1 }} /></Grid>
                        
                        <Grid item xs={6}><Typography variant="h6" color="primary">Net Payable:</Typography></Grid>
                        <Grid item xs={6} textAlign="right"><Typography variant="h6" color="primary">${calcResult.net}</Typography></Grid>
                    </Grid>
                </Paper>
            )}
        </DialogContent>
        <DialogActions>
            <Button onClick={() => { setOpenCalc(false); setCalcResult(null); }}>Close</Button>
            {calcResult && <Button variant="contained" color="success">Process & Save</Button>}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Payroll;