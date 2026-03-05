const asyncHandler = require('express-async-handler');
const Transaction = require('../models/Transaction'); // Ensure Transaction.js is in backend/models

// @desc    Get all sales transactions
// @route   GET /api/sales
// @access  Private
const getSales = asyncHandler(async (req, res) => {
  // Fetch transactions where type is 'Income' and category is 'Sales'
  const sales = await Transaction.find({ type: 'Income', category: 'Sales' })
    .sort({ date: -1 });
  
  res.status(200).json(sales);
});

// @desc    Create a new sale
// @route   POST /api/sales
// @access  Private
const createSale = asyncHandler(async (req, res) => {
  const { amount, description, referenceId } = req.body;

  if (!amount) {
    res.status(400);
    throw new Error('Please add an amount');
  }

  const sale = await Transaction.create({
    company: req.company._id, // company is attached by the 'protect' middleware
    type: 'Income',
    category: 'Sales',
    amount,
    description,
    referenceId
  });

  res.status(201).json(sale);
});

module.exports = { getSales, createSale };