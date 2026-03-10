const mongoose = require('mongoose');

const qualityReportSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productionOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductionOrder' },
  inspector: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    required: true,
    enum: ['Pass', 'Fail', 'Pending'],
    default: 'Pending',
  },
  notes: { type: String },
  metrics: { type: mongoose.Schema.Types.Mixed }, // For storing key-value pairs of measurements
}, { timestamps: true });

module.exports = mongoose.model('QualityReport', qualityReportSchema);