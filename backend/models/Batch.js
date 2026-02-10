const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
  batchNumber: { type: String, required: true },
  quantity: { type: Number, default: 0 },
  expiryDate: { type: Date },
  manufacturingDate: { type: Date },
  barcode: { type: String }
}, { timestamps: true });

// Ensure unique batch per product per warehouse
batchSchema.index({ product: 1, batchNumber: 1, warehouse: 1 }, { unique: true });

module.exports = mongoose.model('Batch', batchSchema);