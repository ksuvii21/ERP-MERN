const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  category: String, // Electronics, Raw Materials, etc.
  address: String,
  rating: { type: Number, default: 0 }, // 0-5 stars
  performanceScore: { type: Number, default: 0 }, // AI calculated 0-100
  deliveryHistory: [{
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'PurchaseOrder' },
    deliveryTime: Number, // Days
    qualityRating: Number // 1-5
  }]
}, { timestamps: true });

module.exports = mongoose.model('Supplier', supplierSchema);