const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  name: { type: String, required: true },
  sku: { type: String, required: true }, // Stock Keeping Unit
  description: { type: String },
  type: {
    type: String,
    required: true,
    enum: ['Finished Good', 'Raw Material', 'Service'],
  },
  unitCost: { type: Number, default: 0 },
  salePrice: { type: Number, default: 0 },
  quantityOnHand: { type: Number, default: 0 },
}, { timestamps: true });

// Ensure SKU is unique per company
productSchema.index({ company: 1, sku: 1 }, { unique: true });

module.exports = mongoose.model('Product', productSchema);