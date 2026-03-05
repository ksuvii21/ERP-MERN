const mongoose = require('mongoose');

// Goods Received Note
const grnSchema = mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  purchaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Purchase', required: true },
  receivedDate: { type: Date, default: Date.now },
  itemsReceived: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantityReceived: { type: Number, required: true }
  }],
  notes: { type: String }
}, {
  timestamps: true,
});

module.exports = mongoose.model('GRN', grnSchema);