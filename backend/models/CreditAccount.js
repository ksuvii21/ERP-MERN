const mongoose = require('mongoose');

const creditAccountSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  creditLimit: { type: Number, required: true },
  currentBalance: { type: Number, default: 0 },
  paymentTerms: { type: String, default: 'Net 30' },
  status: { type: String, enum: ['Active', 'Suspended', 'Overdue'], default: 'Active' },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model('CreditAccount', creditAccountSchema);