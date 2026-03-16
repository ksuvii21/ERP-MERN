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
        const prescription = await Prescription.findById(req.params.id)
            .populate('patient', 'name')
            .populate({
                path: 'medicines.medicine',
                model: 'Medicine',
                select: 'name salePrice'
            });

        if (!prescription || prescription.company.toString() !== req.company._id.toString()) {
            return res.status(404).json({ message: 'Prescription not found' });
        }

        prescription.status = status;
        if (status === 'Dispensed') {
            prescription.dispensedBy = req.user._id;
            prescription.dispensedAt = new Date();
            // TODO: Add logic to deduct stock from Medicine batches

            // --- Add to Hospital Bill Logic ---
            if (prescription.medicines && prescription.medicines.length > 0) {
                const Invoice = require('../models/Invoice'); // Import Invoice model

                const invoiceItems = prescription.medicines.map(item => {
                    if (!item.medicine || typeof item.medicine.salePrice === 'undefined') {
                        console.warn(`Skipping billing for medicine ${item.medicine?.name || 'ID:'+item.medicine._id} as it has no sale price.`);
                        return null;
                    }
                    return {
                        description: item.medicine.name,
                        quantity: 1, // Assuming quantity is 1 per prescribed item.
                        price: item.medicine.salePrice,
                        total: item.medicine.salePrice,
                    };
                }).filter(item => item !== null);

                if (invoiceItems.length > 0) {
                    const totalAmount = invoiceItems.reduce((sum, item) => sum + item.total, 0);

                    const newInvoice = new Invoice({
                        company: req.company._id,
                        patient: prescription.patient._id,
                        customerName: prescription.patient.name, // Denormalized for display
                        invoiceDate: new Date(),
                        dueDate: new Date(new Date().setDate(new Date().getDate() + 15)), // Due in 15 days
                        items: invoiceItems,
                        totalAmount: totalAmount,
                        status: 'Unpaid',
                        notes: `Pharmacy charges for Prescription ID: ${prescription._id}`
                    });
                    await newInvoice.save();
                }
            }
        }
        
        await prescription.save();
        res.json(prescription);
    } catch (err) {
        console.error("Error in prescription status update:", err);
        res.status(500).json({ message: "An error occurred while updating the prescription." });
    }
});

module.exports = router;