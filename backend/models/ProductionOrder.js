const mongoose = require('mongoose');

const productionOrderSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  bom: { type: mongoose.Schema.Types.ObjectId, ref: 'BillOfMaterials', required: true },
  quantityToProduce: { type: Number, required: true },
  status: {
    type: String,
    required: true,
    enum: ['Planned', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Planned',
  },
  scheduledDate: { type: Date },
  completionDate: { type: Date },
  notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('ProductionOrder', productionOrderSchema);