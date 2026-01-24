const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');
const { ROLES, ALL_ROLES } = require('../config/roles');

// @route   GET api/products
// @desc    Get all products
// @access  Private (All Roles)
router.get('/', authMiddleware(ALL_ROLES), async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST api/products
// @desc    Create a product
// @access  Private (Super Admin, Admin, Manager)
router.post('/', authMiddleware([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER]), async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const product = await newProduct.save();
        res.json(product);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/products/:id
// @desc    Delete a product
// @access  Private (Super Admin, Admin)
router.delete('/:id', authMiddleware([ROLES.SUPER_ADMIN, ROLES.ADMIN]), async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;