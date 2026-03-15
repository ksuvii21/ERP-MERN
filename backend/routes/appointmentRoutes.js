const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { protect } = require('../middleware/authMiddleware');
const logAction = require('../utils/auditLogger');

// @desc    Get all appointments for the company (today)
// @route   GET /api/appointments
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { start, end } = req.query;
    let query = { company: req.company._id };

    // If date range provided, filter by it. Otherwise default to today (optional, or return all)
    if (start && end) {
      query.startTime = { 
        $gte: new Date(start), 
        $lte: new Date(end) 
      };
    }

    const appointments = await Appointment.find(query)
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
      company: req.company._id
    });
    const savedApp = await appointment.save();

    await logAction({
      userId: req.user._id,
      userName: req.user.name,
      action: 'CREATE_APPOINTMENT',
      entity: 'Appointment',
      entityId: savedApp._id,
      company: req.company._id,
    });

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

    if (appointment.company.toString() !== req.company._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    appointment.status = status;
    const updatedAppointment = await appointment.save();

    await logAction({
      userId: req.user._id,
      userName: req.user.name,
      action: 'UPDATE_APPOINTMENT_STATUS',
      entity: 'Appointment',
      entityId: updatedAppointment._id,
      company: req.company._id,
    });

    res.json(updatedAppointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @desc    Reschedule an appointment (update time)
// @route   PUT /api/appointments/:id/reschedule
// @access  Private
router.put('/:id/reschedule', protect, async (req, res) => {
  try {
    const { startTime, endTime } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    if (appointment.company.toString() !== req.company._id.toString()) return res.status(401).json({ message: 'Not authorized' });

    appointment.startTime = startTime;
    // appointment.endTime = endTime; // If you store end time
    const updatedAppointment = await appointment.save();

    await logAction({
      userId: req.user._id,
      userName: req.user.name,
      action: 'RESCHEDULE_APPOINTMENT',
      entity: 'Appointment',
      entityId: updatedAppointment._id,
      company: req.company._id,
    });

    res.json(updatedAppointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
