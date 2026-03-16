const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
  batchNumber: { type: String, required: true },
  quantity: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
  purchasePrice: { type: Number },
});

const medicineSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  name: { type: String, required: true, trim: true },
  genericName: { type: String, trim: true },
  category: { type: String, required: true },
  supplier: { type: String },
  unit: { type: String, default: 'Tablet' }, // e.g., Tablet, Bottle, Ampule
  reorderLevel: { type: Number, default: 20 },
  safetyBuffer: { type: Number, default: 10 },
  batches: [batchSchema],
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Virtual for total stock calculation
medicineSchema.virtual('totalStock').get(function() {
  if (!this.batches) return 0;
  return this.batches.reduce((total, batch) => total + batch.quantity, 0);
});

module.exports = mongoose.model('Medicine', medicineSchema);