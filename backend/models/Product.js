const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, unique: true, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  gstRate: { type: Number, default: 0 },
  hsnCode: { type: String },
  description: String,
  // AI Fields (Cached from analysis)
  aiInsights: {
    demandLevel: { type: String, enum: ['Low', 'Stable', 'High', 'Very High'], default: 'Stable' },
    deadStockRisk: { type: Boolean, default: false },
    lastAnalyzed: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);