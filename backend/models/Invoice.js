const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String },
  invoiceNumber: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ['Draft', 'Sent', 'Paid', 'Overdue', 'Void'],
    default: 'Draft',
  },
  items: [{
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
  }],
  totalAmount: { type: Number, required: true },
  issueDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
}, { timestamps: true });

// Ensure invoice number is unique per company
invoiceSchema.index({ company: 1, invoiceNumber: 1 }, { unique: true });

module.exports = mongoose.model('Invoice', invoiceSchema);