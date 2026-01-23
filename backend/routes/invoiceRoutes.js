const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const authMiddleware = require('../middleware/auth');

// @route   GET api/invoices
// @desc    Get all invoices
// @access  Private
router.get('/', authMiddleware(), async (req, res) => {
    try {
        const invoices = await Invoice.find().populate('saleId');
        res.json(invoices);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST api/invoices
// @desc    Create an invoice
// @access  Private
router.post('/', authMiddleware(), async (req, res) => {
    try {
        const newInvoice = new Invoice(req.body);
        const invoice = await newInvoice.save();
        res.json(invoice);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;