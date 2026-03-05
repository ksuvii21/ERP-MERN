const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., 'SUPER_ADMIN', 'HR', 'EMPLOYEE'
  permissions: [{ type: String }], // e.g., ['view_payroll', 'manage_users']
  description: String
}, { timestamps: true });

module.exports = mongoose.model('Role', roleSchema);