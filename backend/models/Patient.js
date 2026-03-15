const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true },
  bloodGroup: { type: String },
  allergies: [{ type: String }],
  address: { type: String },
  // Multi-tenancy
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  // Clinical Data
  vitals: [{
    heartRate: Number,
    bpSystolic: Number,
    bpDiastolic: Number,
    recordedAt: { type: Date, default: Date.now }
  }],
  medicalNotes: [{
    note: String,
    doctorName: String,
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);