const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all appointments for the company (today)
// @route   GET /api/appointments
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    // Optional: Filter by today's date
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await Appointment.find({ 
      company: req.user.company,
      startTime: { $gte: startOfDay, $lte: endOfDay }
    })
    .populate('patient')
    .populate('doctor');
    
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Create an appointment (Seed/Test)
// @route   POST /api/appointments
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const appointment = new Appointment({
      ...req.body,
      company: req.user.company
    });
    const savedApp = await appointment.save();
    res.status(201).json(savedApp);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @desc    Update appointment status
// @route   PUT /api/appointments/:id/status
// @access  Private
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.company.toString() !== req.user.company.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    appointment.status = status;
    const updatedAppointment = await appointment.save();
    res.json(updatedAppointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
