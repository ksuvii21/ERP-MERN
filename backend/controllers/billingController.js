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

// @desc    Get invoice analytics (Revenue & Monthly trends)
// @route   GET /api/billing/stats
// @access  Private
const getInvoiceStats = asyncHandler(async (req, res) => {
  const stats = await Invoice.aggregate([
    { $match: { company: req.company._id } },
    {
      $group: {
        _id: { $month: "$dueDate" }, // Group by month
        totalRevenue: { 
          $sum: { $cond: [{ $eq: ["$status", "Paid"] }, "$totalAmount", 0] } 
        },
        totalPending: { 
          $sum: { $cond: [{ $in: ["$status", ["Pending", "Overdue"]] }, "$totalAmount", 0] } 
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id": 1 } } // Sort by month Jan-Dec
  ]);

  // Map month numbers to names (optional, can be done on frontend)
  const enrichedStats = stats.map(s => ({
    ...s,
    month: new Date(0, s._id - 1).toLocaleString('default', { month: 'short' })
  }));

  res.status(200).json(enrichedStats);
});

module.exports = { getInvoices, createInvoice, getInvoiceStats };