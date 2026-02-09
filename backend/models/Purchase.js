const mongoose = require('mongoose');

const purchaseSchema = mongoose.Schema({
  supplierName: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  items: [{ type: String }],
  status: { type: String, default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Purchase', purchaseSchema);