const asyncHandler = require('express-async-handler');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const MedicalRecord = require('../models/MedicalRecord');
const Pharmacy = require('../models/Pharmacy');
const Invoice = require('../models/Invoice');

// @desc    Get all patients
// @route   GET /api/patients
const getPatients = asyncHandler(async (req, res) => {
  const patients = await Patient.find({ company: req.company._id });
  res.json(patients);
});

// @desc    Add a new patient
// @route   POST /api/patients
const addPatient = asyncHandler(async (req, res) => {
  const patient = await Patient.create({ ...req.body, company: req.company._id });
  res.status(201).json(patient);
});

// @desc    Get all doctors
// @route   GET /api/doctors
const getDoctors = asyncHandler(async (req, res) => {
  const doctors = await Doctor.find({ company: req.company._id });
  res.json(doctors);
});

// @desc    Add a new doctor
// @route   POST /api/doctors
const addDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.create({ ...req.body, company: req.company._id });
  res.status(201).json(doctor);
});

// @desc    Get all appointments
// @route   GET /api/appointments
const getAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ company: req.company._id })
    .populate('patient', 'name')
    .populate('doctor', 'name');
  res.json(appointments);
});

// @desc    Schedule an appointment
// @route   POST /api/appointments
const addAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.create({ ...req.body, company: req.company._id });
  const populated = await Appointment.findById(appointment._id)
    .populate('patient', 'name')
    .populate('doctor', 'name');
  res.status(201).json(populated);
});

// @desc    Get medical records
// @route   GET /api/records
const getRecords = asyncHandler(async (req, res) => {
  const records = await MedicalRecord.find({ company: req.company._id })
    .populate('patient', 'name');
  res.json(records);
});

// @desc    Get pharmacy inventory
// @route   GET /api/pharmacy
const getPharmacy = asyncHandler(async (req, res) => {
  const inventory = await Pharmacy.find({ company: req.company._id });
  res.json(inventory);
});

// @desc    Get billing invoices
// @route   GET /api/billing/invoices
const getInvoices = asyncHandler(async (req, res) => {
  const invoices = await Invoice.find({ company: req.company._id });
  res.json(invoices);
});

module.exports = {
  getPatients, addPatient,
  getDoctors, addDoctor,
  getAppointments, addAppointment,
  getRecords,
  getPharmacy,
  getInvoices
};