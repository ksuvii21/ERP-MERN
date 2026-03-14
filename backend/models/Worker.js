const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  trade: { type: String, required: true }, // e.g., Electrician, Plumber
  contact: { type: String, required: true },
  hourlyRate: { type: Number, required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Worker', workerSchema);