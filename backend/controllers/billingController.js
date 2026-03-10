const asyncHandler = require('express-async-handler');
const Invoice = require('../models/Invoice');

// @desc    Get all invoices for the company
// @route   GET /api/billing/invoices
// @access  Private
const getInvoices = asyncHandler(async (req, res) => {
  const invoices = await Invoice.find({ company: req.company._id }).sort({ issueDate: -1 });
  res.status(200).json(invoices);
});

// @desc    Create a new invoice
// @route   POST /api/billing/invoices
// @access  Private
const createInvoice = asyncHandler(async (req, res) => {
  const { customerName, customerEmail, items, dueDate, status } = req.body;

  if (!customerName || !items || items.length === 0 || !dueDate) {
    res.status(400);
    throw new Error('Please provide customer name, items, and a due date.');
  }

  // Calculate total amount from items
  const totalAmount = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);

  // Generate a simple invoice number (in a real app, this should be more robust)
  const invoiceCount = await Invoice.countDocuments({ company: req.company._id });
  const invoiceNumber = `INV-${(invoiceCount + 1).toString().padStart(4, '0')}`;

  const invoice = await Invoice.create({
    company: req.company._id,
    customerName,
    customerEmail,
    items,
    dueDate,
    status,
    totalAmount,
    invoiceNumber,
  });

  res.status(201).json(invoice);
});

module.exports = { getInvoices, createInvoice };