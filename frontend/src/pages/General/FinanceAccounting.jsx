import React, { useState } from 'react';
import {
  Container, Typography, Box, Tabs, Tab, Paper, Grid, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import { AccountBalance, Receipt, Description, Book } from '@mui/icons-material';

// Mock Data for demonstration
const JOURNAL_ENTRIES = [
  { id: 1, date: '2023-10-25', description: 'Office Rent Payment', debit: 5000, credit: 0, account: 'Rent Expense' },
  { id: 2, date: '2023-10-25', description: 'Cash Withdrawal', debit: 0, credit: 5000, account: 'Bank' },
];

const ACCOUNTS = [
  { code: '1001', name: 'Cash on Hand', type: 'Asset', balance: 15000 },
  { code: '1002', name: 'Bank Account', type: 'Asset', balance: 125000 },
  { code: '2001', name: 'Accounts Payable', type: 'Liability', balance: 4500 },
  { code: '4001', name: 'Sales Revenue', type: 'Revenue', balance: 350000 },
];

const FinanceAccounting = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="800" color="#0f172a">
          Finance & Accounting
        </Typography>
        <Button variant="contained" startIcon={<Description />}>
          New Journal Entry
        </Button>
      </Box>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab icon={<Book />} label="General Ledger" />
          <Tab icon={<AccountBalance />} label="Chart of Accounts" />
          <Tab icon={<Receipt />} label="Accounts Payable" />
          <Tab icon={<Description />} label="Accounts Receivable" />
        </Tabs>
      </Paper>

      {/* General Ledger Tab */}
      {tabValue === 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Recent Journal Entries</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Account</TableCell>
                  <TableCell align="right">Debit</TableCell>
                  <TableCell align="right">Credit</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {JOURNAL_ENTRIES.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.date}</TableCell>
                    <TableCell>{entry.description}</TableCell>
                    <TableCell>{entry.account}</TableCell>
                    <TableCell align="right">{entry.debit > 0 ? `$${entry.debit}` : '-'}</TableCell>
                    <TableCell align="right">{entry.credit > 0 ? `$${entry.credit}` : '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Chart of Accounts Tab */}
      {tabValue === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Chart of Accounts</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>Account Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Balance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ACCOUNTS.map((account) => (
                  <TableRow key={account.code}>
                    <TableCell>{account.code}</TableCell>
                    <TableCell>{account.name}</TableCell>
                    <TableCell>{account.type}</TableCell>
                    <TableCell align="right">${account.balance.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Container>
  );
};

export default FinanceAccounting;