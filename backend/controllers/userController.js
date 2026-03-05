const asyncHandler = require('express-async-handler');
const Employee = require('../models/Employee');

// @desc    Get all users for the logged-in company
// @route   GET /api/users
// @access  Private
const getUsers = asyncHandler(async (req, res) => {
  // req.company is attached by the 'protect' middleware.
  // We fetch employees associated with the logged-in company.
  const employees = await Employee.find({ companyId: req.company._id });
  res.status(200).json(employees);
});

module.exports = { getUsers };