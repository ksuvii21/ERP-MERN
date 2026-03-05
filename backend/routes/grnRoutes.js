const express = require('express');
const router = express.Router();
const GRN = require('../models/GRN');
const { protect } = require('../middleware/authMiddleware');

// @route   GET api/grn
// @desc    Get all GRNs
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const grns = await GRN.find({ companyId: req.company._id }).populate('purchaseId');
        res.json(grns);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST api/grn
// @desc    Create a GRN
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const newGRN = new GRN({ ...req.body, companyId: req.company._id });
        const grn = await newGRN.save();
        res.json(grn);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;