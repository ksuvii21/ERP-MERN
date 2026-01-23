const mongoose = require('mongoose');

const purchaseSchema = mongoose.Schema({
  supplierName: { type: String, required: true },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true },
    cost: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'Ordered' }, // Ordered, Received
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Purchase', purchaseSchema);