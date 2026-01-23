const mongoose = require('mongoose');

const saleSchema = mongoose.Schema({
  customerName: { type: String, required: true },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'Pending' }, // Pending, Completed, Cancelled
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Sale', saleSchema);