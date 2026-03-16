const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true },
  total: { type: Number, required: true },
});

const invoiceSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }, // Link to patient for healthcare
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }, // Link to customer for general sales
  customerName: { type: String, required: true }, // Denormalized for easy display
  invoiceDate: { type: Date, default: Date.now },
  dueDate: { type: Date },
  items: [invoiceItemSchema],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Draft', 'Sent', 'Paid', 'Unpaid', 'Overdue', 'Cancelled'],
    default: 'Unpaid',
  },
  notes: { type: String },
  paymentRecords: [{
    date: { type: Date, default: Date.now },
    amount: Number,
    method: String, // 'Cash', 'Card', 'UPI'
  }],
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);