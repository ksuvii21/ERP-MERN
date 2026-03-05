const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Private
const getProducts = asyncHandler(async (req, res) => {
  // req.company is attached by the 'protect' middleware
  const products = await Product.find({ companyId: req.company._id });
  res.json(products);
});

module.exports = { getProducts };