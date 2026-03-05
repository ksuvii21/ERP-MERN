const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const { protect } = require('../middleware/authMiddleware');

// @route   GET api/invoices
// @desc    Get all invoices
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const invoices = await Invoice.find({ companyId: req.company._id }).populate('saleId');
        res.json(invoices);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST api/invoices
// @desc    Create an invoice
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const newInvoice = new Invoice({ ...req.body, companyId: req.company._id });
        const invoice = await newInvoice.save();
        res.json(invoice);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;