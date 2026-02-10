const mongoose = require('mongoose');

const reorderRuleSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' }, // Null implies global rule
  minStockLevel: { type: Number, required: true },
  maxStockLevel: { type: Number, required: true },
  autoReorder: { type: Boolean, default: false },
  preferredSupplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' }
}, { timestamps: true });

module.exports = mongoose.model('ReorderRule', reorderRuleSchema);