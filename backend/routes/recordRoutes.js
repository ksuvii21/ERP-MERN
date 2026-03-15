const express = require('express');
const router = express.Router();
const MedicalRecord = require('../models/MedicalRecord');
const Patient = require('../models/Patient');
const { protect } = require('../middleware/authMiddleware');

// @desc    Search for patients to load their records
// @route   GET /api/records/search-patients
// @access  Private
router.get('/search-patients', protect, async (req, res) => {
  try {
    const { term } = req.query;
    if (!term) {
      return res.json([]);
    }
    const searchRegex = new RegExp(term, 'i');
    const patients = await Patient.find({
      company: req.user.company,
      $or: [{ name: searchRegex }, { email: searchRegex }, { contact: searchRegex }]
    }).select('name age gender bloodGroup allergies').limit(10);
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get all records for a specific patient (the timeline)
// @route   GET /api/records/patient/:patientId
// @access  Private
router.get('/patient/:patientId', protect, async (req, res) => {
  try {
    const records = await MedicalRecord.find({
      company: req.user.company,
      patient: req.params.patientId
    }).sort({ eventDate: -1 }).populate('recordedBy', 'name');
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Add a new medical record for a patient
// @route   POST /api/records
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const newRecord = new MedicalRecord({ ...req.body, company: req.user.company, recordedBy: req.user._id });
        await newRecord.save();
        res.status(201).json(newRecord);
    } catch(err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;