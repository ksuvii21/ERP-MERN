const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const authMiddleware = require('../middleware/auth');
const { ROLES } = require('../config/roles.js');

// @route   GET api/invoices
// @desc    Get all invoices
// @access  Private (Super Admin, Admin, Finance)
router.get('/', authMiddleware([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.FINANCE]), async (req, res) => {
    try {
        const invoices = await Invoice.find().populate('saleId');
        res.json(invoices);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST api/invoices
// @desc    Create an invoice
// @access  Private (Super Admin, Admin, Finance)
router.post('/', authMiddleware([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.FINANCE]), async (req, res) => {
    try {
        const newInvoice = new Invoice(req.body);
        const invoice = await newInvoice.save();
        res.json(invoice);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;