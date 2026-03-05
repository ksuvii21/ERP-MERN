const mongoose = require('mongoose');

/**
 * Represents a company within the multi-tenant system.
 * Each company has its own isolated data, linked to an owner.
 */
const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    unique: true,
  },
  industry: {
    type: String,
    required: [true, 'Industry is required'],
    enum: [
      'Healthcare',
      'Retail',
      'Wholesale',
      'Manufacturing',
      'General Business',
      'Construction',
      'Hospitality',
      'Education',
    ],
  },
  companySize: {
    type: String,
    required: [true, 'Company size is required'],
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
  },
  timezone: {
    type: String,
    required: [true, 'Timezone is required'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  employees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Company', CompanySchema);