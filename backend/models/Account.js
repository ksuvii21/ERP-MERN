const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'] 
  },
  subtype: String, // e.g., 'Current Asset', 'Long-term Liability'
  balance: { type: Number, default: 0 }, // Natural balance (Debit for Assets/Exp, Credit for Liab/Eq/Rev)
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Account', accountSchema);