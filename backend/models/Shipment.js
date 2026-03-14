const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  trackingNumber: { type: String, required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'BulkOrder', required: true },
  carrier: { type: String, required: true },
  status: { type: String, enum: ['Processing', 'In Transit', 'Out for Delivery', 'Delivered'], default: 'Processing' },
  estimatedDelivery: { type: Date },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Shipment', shipmentSchema);