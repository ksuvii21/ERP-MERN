const asyncHandler = require('express-async-handler');
const Purchase = require('../models/Purchase');

// @desc    Get all purchases
// @route   GET /api/purchases
// @access  Private
const getPurchases = asyncHandler(async (req, res) => {
  // req.company is attached by the 'protect' middleware
  const purchases = await Purchase.find({ companyId: req.company._id });
  res.json(purchases);
});

module.exports = { getPurchases };