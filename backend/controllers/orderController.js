const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ company: req.company._id })
    .populate('customer', 'name email')
    .sort({ createdAt: -1 });
  res.status(200).json(orders);
});

// @desc    Create an order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { customerId, totalAmount, status, items, notes } = req.body;

  if (!customerId || !totalAmount) {
    res.status(400);
    throw new Error('Please add customer and total amount');
  }

  const order = await Order.create({
    customer: customerId,
    totalAmount,
    status,
    items,
    notes,
    company: req.company._id,
  });

  const populatedOrder = await Order.findById(order._id).populate('customer', 'name email');
  res.status(201).json(populatedOrder);
});

// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  Private
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOneAndDelete({ _id: req.params.id, company: req.company._id });
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  res.status(200).json({ id: req.params.id });
});

module.exports = { getOrders, createOrder, deleteOrder };