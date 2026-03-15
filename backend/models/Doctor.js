const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' } // Multi-tenancy
}, {
  timestamps: true,
});

module.exports = mongoose.model('Doctor', doctorSchema);