const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema({
  source: { type: String, enum: ['Pharmacy', 'Lab', 'Consultation', 'Room Rent', 'Procedure', 'Uncategorized'], default: 'Uncategorized' }, // Crucial for ERP tracking
  description: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true },
  total: { type: Number, required: true },
});

const ledgerEntrySchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['Debit', 'Credit'], required: true }, // Debit = Charge, Credit = Payment
  method: { type: String }, // e.g., 'Cash', 'Card', 'Insurance Adjustment'
});

const invoiceSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }, // Link to patient for healthcare
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }, // Link to customer for general sales
  customerName: { type: String, required: true }, // Denormalized for easy display
  invoiceNumber: { type: String, required: true },
  invoiceDate: { type: Date, default: Date.now },
  dueDate: { type: Date },
  items: [invoiceItemSchema],
  totalAmount: { type: Number, required: true },
  insurancePayable: { type: Number, default: 0 },
  patientPayable: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Draft', 'Pro-forma', 'Open', 'Partial', 'Paid', 'Cancelled'],
    default: 'Draft',
  },
  notes: { type: String },
  ledgerEntries: [ledgerEntrySchema],
}, { timestamps: true });

// Ensure invoice numbers are unique per company
invoiceSchema.index({ company: 1, invoiceNumber: 1 }, { unique: true });

module.exports = mongoose.model('Invoice', invoiceSchema);