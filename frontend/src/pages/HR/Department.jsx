const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  budget: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Department', departmentSchema);