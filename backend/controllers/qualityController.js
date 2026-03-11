const QualityControl = require('../models/QualityControl');
const factory = require('../utils/handlerFactory');

// @desc    Get all quality control checks
// @route   GET /api/quality
// @access  Private
exports.getQualityChecks = factory.getAll(QualityControl);

// @desc    Create a quality control check
// @route   POST /api/quality
// @access  Private
exports.createQualityCheck = factory.createOne(QualityControl, ['product', 'productionOrder', 'status', 'notes']);

// @desc    Get a single quality control check
// @route   GET /api/quality/:id
// @access  Private
exports.getQualityCheck = factory.getOne(QualityControl);

// @desc    Update a quality control check
// @route   PATCH /api/quality/:id
// @access  Private
exports.updateQualityCheck = factory.updateOne(QualityControl);

// @desc    Delete a quality control check
// @route   DELETE /api/quality/:id
// @access  Private
exports.deleteQualityCheck = factory.deleteOne(QualityControl);