const Customer = require('../models/Customer');
const factory = require('../utils/handlerFactory');

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private
exports.getCustomers = factory.getAll(Customer);

// @desc    Create a customer
// @route   POST /api/customers
// @access  Private
exports.createCustomer = factory.createOne(Customer, ['name', 'email', 'phone']);

// @desc    Delete a customer
// @route   DELETE /api/customers/:id
// @access  Private
exports.deleteCustomer = factory.deleteOne(Customer);