const mongoose = require('mongoose');

const taxRuleSchema = new mongoose.Schema({
  hsnCode: { type: String, required: true, unique: true },
  description: String,
  gstRate: { type: Number, required: true }, // Combined Rate (e.g., 18)
  cess: { type: Number, default: 0 },
  effectiveFrom: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('TaxRule', taxRuleSchema);