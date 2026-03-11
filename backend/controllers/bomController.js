const BillOfMaterials = require('../models/BillOfMaterials');
const factory = require('../utils/handlerFactory');

// @desc    Get all Bills of Materials
// @route   GET /api/boms
// @access  Private
exports.getBoms = factory.getAll(BillOfMaterials);

// @desc    Create a Bill of Materials
// @route   POST /api/boms
// @access  Private
exports.createBom = factory.createOne(BillOfMaterials, ['name', 'product', 'description', 'components']);

// @desc    Get a single Bill of Materials
// @route   GET /api/boms/:id
// @access  Private
exports.getBom = factory.getOne(BillOfMaterials, { path: 'components.component', select: 'name sku' });

// @desc    Update a Bill of Materials
// @route   PATCH /api/boms/:id
// @access  Private
exports.updateBom = factory.updateOne(BillOfMaterials);

// @desc    Delete a Bill of Materials
// @route   DELETE /api/boms/:id
// @access  Private
exports.deleteBom = factory.deleteOne(BillOfMaterials);