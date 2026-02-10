const mongoose = require('mongoose');

const reportTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  module: { type: String, required: true, enum: ['Sales', 'Inventory', 'Finance', 'HR'] },
  columns: [{ type: String }], // Array of selected field names
  filters: {
    dateRange: { type: String, default: 'Custom' },
    status: String
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('ReportTemplate', reportTemplateSchema);