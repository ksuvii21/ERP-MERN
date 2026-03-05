const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  contactEmail: String,
  settings: { type: Map, of: String } // Flexible config for ERP modules
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);