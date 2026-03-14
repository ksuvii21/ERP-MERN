const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  title: { type: String, required: true },
  contractorName: { type: String, required: true },
  value: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Active', 'Completed', 'Terminated'], default: 'Pending' },
  startDate: { type: Date },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Contract', contractSchema);