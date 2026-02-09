const asyncHandler = require('express-async-handler');
const Purchase = require('../models/Purchase');

// @desc    Get all purchases
// @route   GET /api/purchases
// @access  Private
const getPurchases = asyncHandler(async (req, res) => {
  const purchases = await Purchase.find({});
  res.json(purchases);
});

module.exports = { getPurchases };