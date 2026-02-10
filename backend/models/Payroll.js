const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  month: String, // e.g., "2026-02"
  year: Number,
  salaryDetails: {
    basic: Number,
    hra: Number,
    da: Number,
    allowances: Number,
    gross: Number,
    deductions: {
      pf: Number,
      tax: Number,
      other: Number
    },
    netSalary: Number
  },
  status: { type: String, enum: ['Draft', 'Processed', 'Paid'], default: 'Draft' },
  paymentDate: Date
}, { timestamps: true });

module.exports = mongoose.model('Payroll', payrollSchema);