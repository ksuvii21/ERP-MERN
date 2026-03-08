const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
  },
  address: {
    type: String,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
}, { timestamps: true });

// Compound index to ensure unique emails per company
CustomerSchema.index({ email: 1, company: 1 }, { unique: true });

module.exports = mongoose.model('Customer', CustomerSchema);
