// routes/patient.js
const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const { protect } = require('../middleware/authMiddleware');
const logAction = require('../utils/auditLogger');

// Get all patients for the user's company
router.get('/', protect, async (req, res) => {
  try {
    // Corrected to use req.user.company which is the ID from the user model
    const patients = await Patient.find({ company: req.user.company });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create patient linked to user's company
router.post('/', protect, async (req, res) => {
  const patient = new Patient({
    ...req.body,
    // Corrected from req.user.companyId to req.user.company
    company: req.user.company
  });

  try {
    const newPatient = await patient.save();
    
    await logAction({
      userId: req.user._id,
      userName: req.user.name,
      action: 'CREATE_PATIENT',
      entityId: newPatient._id,
      companyId: req.user.company,
    });

    res.status(201).json(newPatient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @desc    Update a patient's details
// @route   PUT /api/patients/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Authorization check: ensure the patient belongs to the user's company
    if (patient.company.toString() !== req.user.company.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedPatient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    await logAction({
      userId: req.user._id,
      userName: req.user.name,
      action: 'UPDATE_PATIENT',
      entityId: updatedPatient._id,
      companyId: req.user.company,
    });

    res.json(updatedPatient);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @desc    Update a patient's privacy settings
// @route   PUT /api/patients/:id/privacy
// @access  Private
router.put('/:id/privacy', protect, async (req, res) => {
  try {
    const { portalSync, dataMasking } = req.body;
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    if (patient.company.toString() !== req.user.company.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    patient.privacySettings = { portalSync, dataMasking };
    await patient.save({ validateModifiedOnly: true }); // Avoid re-validating entire doc

    await logAction({
      userId: req.user._id,
      userName: req.user.name,
      action: 'UPDATE_PATIENT_PRIVACY',
      entityId: patient._id,
      companyId: req.user.company,
    });

    res.json(patient.privacySettings);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @desc    Delete a patient
// @route   DELETE /api/patients/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Authorization check
    if (patient.company.toString() !== req.user.company.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await logAction({
      userId: req.user._id,
      userName: req.user.name,
      action: 'DELETE_PATIENT',
      entityId: patient._id,
      companyId: req.user.company,
    });

    await patient.deleteOne();
    res.json({ message: 'Patient removed successfully' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;