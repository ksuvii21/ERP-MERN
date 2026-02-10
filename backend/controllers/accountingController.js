const Account = require('../models/Account');
const JournalEntry = require('../models/JournalEntry');
const axios = require('axios');

// Helper: Update account balances based on natural balance rules
const updateBalances = async (entries) => {
  for (const entry of entries) {
    const account = await Account.findById(entry.account);
    if (account) {
      let change = 0;
      // Assets & Expenses: Debit increases (+), Credit decreases (-)
      if (['Asset', 'Expense'].includes(account.type)) {
        change = (entry.debit || 0) - (entry.credit || 0);
      } 
      // Liabilities, Equity, Revenue: Credit increases (+), Debit decreases (-)
      else {
        change = (entry.credit || 0) - (entry.debit || 0);
      }
      account.balance += change;
      await account.save();
    }
  }
};

// @desc    Create a Double Entry Journal
// @route   POST /api/accounting/journal
const createJournalEntry = async (req, res) => {
  const { date, description, reference, entries, status } = req.body;
  
  // 1. Validate Double Entry (Debits must equal Credits)
  const totalDebit = entries.reduce((sum, e) => sum + (e.debit || 0), 0);
  const totalCredit = entries.reduce((sum, e) => sum + (e.credit || 0), 0);
  
  if (Math.abs(totalDebit - totalCredit) > 0.01) {
    return res.status(400).json({ message: 'Unbalanced Entry: Debits must equal Credits' });
  }

  try {
    const journalEntry = await JournalEntry.create({
      date, description, reference, entries, totalAmount: totalDebit, postedBy: req.user?._id, status
    });

    if (status === 'Posted') {
      await updateBalances(entries);
    }

    res.status(201).json(journalEntry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate Balance Sheet
// @route   GET /api/accounting/balance-sheet
const getBalanceSheet = async (req, res) => {
  try {
    const assets = await Account.find({ type: 'Asset' });
    const liabilities = await Account.find({ type: 'Liability' });
    const equity = await Account.find({ type: 'Equity' });
    
    const totalAssets = assets.reduce((acc, curr) => acc + curr.balance, 0);
    const totalLiabilities = liabilities.reduce((acc, curr) => acc + curr.balance, 0);
    const totalEquity = equity.reduce((acc, curr) => acc + curr.balance, 0);

    res.json({ assets, liabilities, equity, totalAssets, totalLiabilities, totalEquity });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate Profit & Loss Statement
// @route   GET /api/accounting/pl
const getProfitLoss = async (req, res) => {
  try {
    const revenue = await Account.find({ type: 'Revenue' });
    const expenses = await Account.find({ type: 'Expense' });
    
    const totalRevenue = revenue.reduce((acc, curr) => acc + curr.balance, 0);
    const totalExpense = expenses.reduce((acc, curr) => acc + curr.balance, 0);
    
    res.json({ revenue, expenses, netProfit: totalRevenue - totalExpense });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    AI Cashflow Prediction
// @route   POST /api/accounting/predict-cashflow
const predictCashflow = async (req, res) => {
  try {
    const { history } = req.body; // Array of past monthly net cash flows
    
    // Call Python AI Service
    // const response = await axios.post('http://localhost:8000/predict/cashflow', { history });
    // res.json(response.data);

    // Fallback Simulation
    const lastVal = history[history.length - 1] || 0;
    res.json({ prediction: lastVal * 1.05, trend: 'Positive', confidence: 0.85 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createJournalEntry, getBalanceSheet, getProfitLoss, predictCashflow };