const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false, // Don't return password by default
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
}, { timestamps: true });

// Encrypt password using bcrypt before saving
CompanySchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('Company', CompanySchema);