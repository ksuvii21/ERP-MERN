const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, unique: true },
  category: String,
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  minStockLevel: { type: Number, default: 10 },
  predictedDemand: { type: String } // AI Field: 'High', 'Medium', 'Low'
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);