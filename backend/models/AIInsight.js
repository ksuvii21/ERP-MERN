const mongoose = require('mongoose');

const aiInsightSchema = new mongoose.Schema({
  type: { 
    type: String, 
    required: true, 
    enum: ['Attrition', 'SalesForecast', 'ExpenseAnomaly', 'InventoryRisk', 'Burnout'] 
  },
  relatedId: { type: mongoose.Schema.Types.ObjectId }, // ID of User, Product, etc.
  relatedModel: { type: String }, // 'User', 'Product', etc.
  data: mongoose.Schema.Types.Mixed, // Flexible payload for the insight details
  summary: String, // Plain text explanation for the Chatbot
  confidenceScore: Number,
  createdAt: { type: Date, default: Date.now, expires: '30d' } // Auto-delete insights after 30 days
});

module.exports = mongoose.model('AIInsight', aiInsightSchema);