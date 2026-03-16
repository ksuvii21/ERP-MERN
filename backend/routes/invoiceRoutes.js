const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all invoices for the company
// @route   GET /api/billing/invoices
// @access  Private
router.get('/invoices', protect, async (req, res) => {
  try {
    const invoices = await Invoice.find({ company: req.company._id }).sort({ invoiceDate: -1 });
    res.json(invoices);
  } catch (err) {
    console.error("Error fetching invoices:", err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get billing statistics for the company
// @route   GET /api/billing/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    // In a real application, this would involve more complex aggregation pipelines
    // to calculate various financial metrics (e.g., revenue by service, aging receivables).
    const totalInvoices = await Invoice.countDocuments({ company: req.company._id });
    const totalPaidAmount = await Invoice.aggregate([
      { $match: { company: req.company._id, status: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalOpenAmount = await Invoice.aggregate([
      { $match: { company: req.company._id, status: 'Open' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.json({
      totalInvoices,
      totalPaid: totalPaidAmount[0]?.total || 0,
      totalOpen: totalOpenAmount[0]?.total || 0,
      // Example: Placeholder for a simple stat
      averageInvoiceValue: totalInvoices > 0 ? ((totalPaidAmount[0]?.total || 0) + (totalOpenAmount[0]?.total || 0)) / totalInvoices : 0,
    });
  } catch (err) {
    console.error("Error fetching billing stats:", err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Update invoice status to Paid (placeholder for payment processing)
// @route   PUT /api/billing/invoices/:id/pay
// @access  Private
router.put('/invoices/:id/pay', protect, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice || invoice.company.toString() !== req.company._id.toString()) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Only update if not already paid
    if (invoice.status !== 'Paid') {
      invoice.status = 'Paid';
      // In a real system, you'd add a detailed ledger entry for the payment received
      invoice.ledgerEntries.push({ date: new Date(), amount: invoice.patientPayable, type: 'Credit', method: 'Cash' }); // Assuming cash for simplicity
      await invoice.save();
    }
    
    res.json(invoice);
  } catch (err) {
    console.error("Error updating invoice status to paid:", err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;