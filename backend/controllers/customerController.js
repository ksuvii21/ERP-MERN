const asyncHandler = require('express-async-handler');
const Customer = require('../models/Customer');

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private
const getCustomers = asyncHandler(async (req, res) => {
  const customers = await Customer.find({ company: req.company._id }).sort({ createdAt: -1 });
  res.status(200).json(customers);
});

// @desc    Create a customer
// @route   POST /api/customers
// @access  Private
const createCustomer = asyncHandler(async (req, res) => {
  const { name, email, phone, address } = req.body;

  if (!name || !email || !phone) {
    res.status(400);
    throw new Error('Please add all required fields');
  }

  const customer = await Customer.create({
    name,
    email,
    phone,
    address,
    company: req.company._id,
  });

  res.status(201).json(customer);
});

// @desc    Delete a customer
// @route   DELETE /api/customers/:id
// @access  Private
const deleteCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findOneAndDelete({ _id: req.params.id, company: req.company._id });
  if (!customer) {
    res.status(404);
    throw new Error('Customer not found');
  }
  res.status(200).json({ id: req.params.id });
});

module.exports = { getCustomers, createCustomer, deleteCustomer };