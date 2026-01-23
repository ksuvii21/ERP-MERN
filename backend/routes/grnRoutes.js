const express = require('express');
const router = express.Router();
const GRN = require('../models/GRN');
const authMiddleware = require('../middleware/auth');

// @route   GET api/grn
// @desc    Get all GRNs
// @access  Private
router.get('/', authMiddleware(), async (req, res) => {
    try {
        const grns = await GRN.find().populate('purchaseId');
        res.json(grns);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST api/grn
// @desc    Create a GRN
// @access  Private
router.post('/', authMiddleware(), async (req, res) => {
    try {
        const newGRN = new GRN(req.body);
        const grn = await newGRN.save();
        res.json(grn);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;