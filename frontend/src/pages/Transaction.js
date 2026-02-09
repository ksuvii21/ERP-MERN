const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  type: { type: String, enum: ['Income', 'Expense'], required: true },
  category: { type: String, required: true }, // e.g., 'Sales', 'Travel', 'Salary'
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  description: String,
  referenceId: String, // Invoice ID
  isAnomaly: { type: Boolean, default: false } // AI Flag for fraud/anomaly detection
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);