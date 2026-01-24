const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const authMiddleware = require('../middleware/auth');
const { ROLES } = require('../config/roles.js');

// @route   GET api/sales
// @desc    Get all sales
// @access  Private (Super Admin, Admin, Finance, Manager, Employee)
router.get('/', authMiddleware([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.FINANCE, ROLES.MANAGER, ROLES.EMPLOYEE]), async (req, res) => {
    try {
        const sales = await Sale.find().populate('products.product', 'name price');
        res.json(sales);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST api/sales
// @desc    Create a sale
// @access  Private (Super Admin, Admin, Manager, Employee)
router.post('/', authMiddleware([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE]), async (req, res) => {
    try {
        const newSale = new Sale({ ...req.body, createdBy: req.user.id });
        const sale = await newSale.save();
        res.json(sale);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;