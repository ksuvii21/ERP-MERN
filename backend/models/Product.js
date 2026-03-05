const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  name: { type: String, required: true },
  sku: { type: String, unique: true },
  category: String,
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  minStockLevel: { type: Number, default: 10 },
  predictedDemand: { type: String } // AI Field: 'High', 'Medium', 'Low'
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);