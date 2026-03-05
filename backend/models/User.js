const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  designation: String,
  skills: [{ type: String }], // Used for AI Resume-Job matching
  isActive: { type: Boolean, default: true },
  attritionRiskScore: { type: Number, default: 0 } // AI Calculated Risk
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);