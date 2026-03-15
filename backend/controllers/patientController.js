const Patient = require('../models/Patient');

// @desc    Get all patients for a specific company
// @route   GET /api/patients
exports.getPatients = async (req, res) => {
  try {
    const patients = await Patient.find({ company: req.user.companyId });
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Create new patient
// @route   POST /api/patients
exports.createPatient = async (req, res) => {
  try {
    const patientData = { ...req.body, company: req.user.companyId };
    const patient = await Patient.create(patientData);
    res.status(201).json(patient);
  } catch (error) {
    res.status(400).json({ message: "Invalid Data", error: error.message });
  }
};

// @desc    Get single patient with full history
// @route   GET /api/patients/:id
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findOne({ _id: req.params.id, company: req.user.companyId });
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};