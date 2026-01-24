const express = require('express');
const router = express.Router();
const Purchase = require('../models/Purchase');
const authMiddleware = require('../middleware/auth');
const { ROLES } = require('../config/roles.js');

// @route   GET api/purchases
// @desc    Get all purchases
// @access  Private (Super Admin, Admin, Finance, Manager)
router.get('/', authMiddleware([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.FINANCE, ROLES.MANAGER]), async (req, res) => {
    try {
        const purchases = await Purchase.find().populate('products.product', 'name');
        res.json(purchases);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST api/purchases
// @desc    Create a purchase order
// @access  Private (Super Admin, Admin, Finance, Manager)
router.post('/', authMiddleware([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.FINANCE, ROLES.MANAGER]), async (req, res) => {
    try {
        const newPurchase = new Purchase({ ...req.body, createdBy: req.user.id });
        const purchase = await newPurchase.save();
        res.json(purchase);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;