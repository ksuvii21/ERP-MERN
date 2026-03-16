const express = require('express');
const router = express.Router();
const Medicine = require('../models/Medicine');
const Prescription = require('../models/Prescription');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get the dispensing queue (pending prescriptions)
// @route   GET /api/pharmacy/dispense-queue
// @access  Private
router.get('/dispense-queue', protect, async (req, res) => {
  try {
    const queue = await Prescription.find({
      company: req.company._id,
      status: { $in: ['Pending', 'Approved'] }
    })
    .populate('patient', 'name age')
    .populate('doctor', 'name')
    .populate('medicines.medicine', 'name genericName totalStock')
    .sort({ urgency: 1, createdAt: 1 }); // Sort by urgency then date
    res.json(queue);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get full pharmacy inventory
// @route   GET /api/pharmacy/inventory
// @access  Private
router.get('/inventory', protect, async (req, res) => {
  try {
    const inventory = await Medicine.find({ company: req.company._id });
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Update prescription status (e.g., approve, dispense)
// @route   PUT /api/pharmacy/prescriptions/:id/status
// @access  Private
router.put('/prescriptions/:id/status', protect, async (req, res) => {
    try {
        const { status } = req.body;
        const prescription = await Prescription.findById(req.params.id);

        if (!prescription || prescription.company.toString() !== req.company._id.toString()) {
            return res.status(404).json({ message: 'Prescription not found' });
        }

        prescription.status = status;
        if (status === 'Dispensed') {
            prescription.dispensedBy = req.user._id;
            prescription.dispensedAt = new Date();
            // TODO: Add logic to deduct stock from Medicine batches
        }
        
        await prescription.save();
        res.json(prescription);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;