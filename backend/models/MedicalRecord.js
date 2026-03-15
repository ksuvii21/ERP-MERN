const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  eventType: {
    type: String,
    required: true,
    enum: ['Vitals', 'Note', 'LabResult', 'Prescription', 'VisitSummary', 'Surgery'],
  },
  // Flexible data structure based on eventType
  // Example for 'Vitals': { heartRate: 72, bp: '120/80', temp: 98.6 }
  // Example for 'Note': { type: 'SOAP', subjective: '...', objective: '...' }
  data: { 
    type: mongoose.Schema.Types.Mixed, 
    required: true 
  },
  // The date the event occurred, defaults to creation date but can be overridden
  eventDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);