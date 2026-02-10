const mongoose = require('mongoose');

const stockMovementSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch' },
  type: { type: String, enum: ['IN', 'OUT', 'TRANSFER', 'ADJUSTMENT', 'RETURN'], required: true },
  quantity: { type: Number, required: true },
  fromWarehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
  toWarehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
  reference: String, // Invoice ID, PO Number, etc.
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('StockMovement', stockMovementSchema);