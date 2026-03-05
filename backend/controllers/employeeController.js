const asyncHandler = require('express-async-handler');
const Employee = require('../models/Employee');

// @desc    Get all employees for the logged-in company
// @route   GET /api/employees
// @access  Private
const getEmployees = asyncHandler(async (req, res) => {
  // req.company is attached by the 'protect' middleware
  const employees = await Employee.find({ companyId: req.company._id });
  res.status(200).json(employees);
});

// @desc    Create an employee for the logged-in company
// @route   POST /api/employees
// @access  Private
const createEmployee = asyncHandler(async (req, res) => {
  const { name, role, department } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Please add an employee name');
  }

  const employee = await Employee.create({
    name,
    role,
    department,
    companyId: req.company._id, // Automatically set companyId
  });

  res.status(201).json(employee);
});

module.exports = { getEmployees, createEmployee };