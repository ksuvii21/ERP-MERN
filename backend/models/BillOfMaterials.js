const mongoose = require('mongoose');

const bomSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  // The finished product this BOM is for
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  description: { type: String },
  components: [{
    // The raw material or sub-assembly
    componentProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 0.0001 },
  }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

bomSchema.index({ company: 1, product: 1 });

module.exports = mongoose.model('BillOfMaterials', bomSchema);