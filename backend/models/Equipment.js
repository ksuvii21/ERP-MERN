const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // e.g., Excavator, Crane
  status: { type: String, enum: ['Available', 'In Use', 'Maintenance', 'Out of Service'], default: 'Available' },
  serialNumber: { type: String },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Equipment', equipmentSchema);