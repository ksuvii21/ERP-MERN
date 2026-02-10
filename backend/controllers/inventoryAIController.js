const Product = require('../models/Product');
const StockMovement = require('../models/StockMovement');
const Batch = require('../models/Batch');
const ReorderRule = require('../models/ReorderRule');

// @desc    Analyze inventory for AI insights
// @route   GET /api/inventory/ai-analysis
const runInventoryAI = async (req, res) => {
  try {
    const products = await Product.find();
    const insights = [];

    for (const product of products) {
      // 1. Demand Prediction (Simple Moving Average of 'OUT' movements over 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const movements = await StockMovement.find({
        product: product._id,
        type: 'OUT',
        date: { $gte: thirtyDaysAgo }
      });

      const totalSold = movements.reduce((acc, curr) => acc + curr.quantity, 0);
      let demandLevel = 'Stable';
      if (totalSold > 100) demandLevel = 'Very High';
      else if (totalSold > 50) demandLevel = 'High';
      else if (totalSold < 5) demandLevel = 'Low';

      // 2. Dead Stock Prediction (No sales in 90 days + High Stock)
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      
      const recentSales = await StockMovement.findOne({
        product: product._id,
        type: 'OUT',
        date: { $gte: ninetyDaysAgo }
      });

      // Check current stock (aggregate from batches)
      const batches = await Batch.find({ product: product._id });
      const currentStock = batches.reduce((acc, b) => acc + b.quantity, 0);

      const isDeadStock = !recentSales && currentStock > 0;

      // Update Product AI Fields
      product.aiInsights = {
        demandLevel,
        deadStockRisk: isDeadStock,
        lastAnalyzed: new Date()
      };
      await product.save();

      // 3. Auto Reorder Suggestions
      const rule = await ReorderRule.findOne({ product: product._id });
      let reorderSuggestion = null;
      
      if (rule && currentStock <= rule.minStockLevel) {
        reorderSuggestion = {
          product: product.name,
          currentStock,
          reorderQty: rule.maxStockLevel - currentStock,
          supplier: rule.preferredSupplier
        };
      }

      insights.push({
        product: product.name,
        demandLevel,
        isDeadStock,
        reorderSuggestion
      });
    }

    res.json({ success: true, insights });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'AI Analysis Failed' });
  }
};

module.exports = { runInventoryAI };