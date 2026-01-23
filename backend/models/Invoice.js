const mongoose = require('mongoose');

const invoiceSchema = mongoose.Schema({
  saleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sale', required: true },
  amountDue: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, default: 'Unpaid' }, // Unpaid, Paid
}, {
  timestamps: true,
});

module.exports = mongoose.model('Invoice', invoiceSchema);