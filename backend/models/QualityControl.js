const mongoose = require('mongoose');

const qualityControlSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productionOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductionOrder' },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Passed', 'Failed'],
    default: 'Pending',
  },
  notes: { type: String },
  inspectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  inspectionDate: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('QualityControl', qualityControlSchema);