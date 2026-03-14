const mongoose = require('mongoose');

const constructionBudgetSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'ConstructionProject', required: true },
  category: { type: String, required: true }, // e.g., Materials, Labor, Permits
  allocatedAmount: { type: Number, required: true },
  spentAmount: { type: Number, default: 0 },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model('ConstructionBudget', constructionBudgetSchema);