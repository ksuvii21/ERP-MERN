const ProductionOrder = require('../models/ProductionOrder');
const factory = require('../utils/handlerFactory');

// @desc    Get all production orders
// @route   GET /api/production
// @access  Private
exports.getProductionOrders = factory.getAll(ProductionOrder);

// @desc    Create a production order
// @route   POST /api/production
// @access  Private
exports.createProductionOrder = factory.createOne(ProductionOrder, ['product', 'bom', 'quantityToProduce', 'scheduledDate']);

// @desc    Get a single production order
// @route   GET /api/production/:id
// @access  Private
exports.getProductionOrder = factory.getOne(ProductionOrder);

// @desc    Update a production order
// @route   PATCH /api/production/:id
// @access  Private
exports.updateProductionOrder = factory.updateOne(ProductionOrder);

// @desc    Delete a production order
// @route   DELETE /api/production/:id
// @access  Private
exports.deleteProductionOrder = factory.deleteOne(ProductionOrder);