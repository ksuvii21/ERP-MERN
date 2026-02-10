const mongoose = require('mongoose');

const purchaseOrderSchema = new mongoose.Schema({
  poNumber: { type: String, required: true, unique: true },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
    unitPrice: Number
  }],
  totalAmount: Number,
  status: { 
    type: String, 
    enum: ['Draft', 'Ordered', 'Dispatched', 'In Transit', 'Received', 'Cancelled'], 
    default: 'Draft' 
  },
  expectedDelivery: Date,
  trackingNumber: String,
  timeline: [{
    status: String,
    date: { type: Date, default: Date.now },
    note: String
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);