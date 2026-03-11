const mongoose = require('mongoose');

const componentSchema = new mongoose.Schema({
  component: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Assuming raw materials are also 'Products'
  quantity: { type: Number, required: true },
});

const billOfMaterialsSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, unique: true }, // One BOM per final product
  name: { type: String, required: true },
  description: { type: String },
  components: [componentSchema],
}, { timestamps: true });

module.exports = mongoose.model('BillOfMaterials', billOfMaterialsSchema);