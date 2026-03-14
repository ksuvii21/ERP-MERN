const mongoose = require('mongoose');

const bulkOrderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true },
  customerName: { type: String, required: true },
  items: [{
    product: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model('BulkOrder', bulkOrderSchema);