const mongoose = require('mongoose');

const prescribedMedicineSchema = new mongoose.Schema({
  medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
  dosage: { type: String, required: true },
  instructions: { type: String },
  duration: { type: String }, // e.g., '7 days'
});

const prescriptionSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  medicines: [prescribedMedicineSchema],
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Dispensed', 'Cancelled'],
    default: 'Pending',
  },
  urgency: {
    type: String,
    enum: ['Stat', 'Urgent', 'Routine'],
    default: 'Routine',
  },
  dispensedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dispensedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);