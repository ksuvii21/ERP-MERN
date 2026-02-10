const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Link to auth user
  department: String,
  designation: String,
  joiningDate: Date,
  salaryStructure: {
    basic: Number,
    hra: Number,
    da: Number,
    allowances: Number,
    pfDeduction: Number, // Percentage
    taxDeduction: Number // Fixed amount or %
  },
  bankDetails: {
    accountNumber: String,
    ifsc: String,
    bankName: String
  },
  leaveBalance: {
    casual: { type: Number, default: 12 },
    sick: { type: Number, default: 10 },
    earned: { type: Number, default: 15 }
  }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);