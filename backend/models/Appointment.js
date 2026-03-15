const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Waiting', 'In-Consultation', 'Completed', 'Cancelled'],
    default: 'Scheduled'
  },
  reason: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Appointment', appointmentSchema);
