const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a company name'],
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    sparse: true, // Crucial: allows multiple 'null' or missing values
    lowercase: true
  },
  industryType: {
    type: String,
    required: [true, 'Please add an industry type'],
    enum: ['Retail', 'Healthcare', 'Manufacturing', 'Wholesale', 'General Business', 'Construction', 'Hospitality', 'Education'],
  },
  subscriptionPlan: {
    type: String,
    enum: ['Basic', 'Pro', 'Enterprise'],
    default: 'Basic',
  },
  companySize: {
    type: String,
  },
  country: {
    type: String,
  },
  timezone: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

module.exports = mongoose.model('Company', CompanySchema);