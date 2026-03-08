const asyncHandler = require('express-async-handler');
const Supplier = require('../models/Supplier');

// @desc    Get all suppliers
// @route   GET /api/suppliers
// @access  Private
const getSuppliers = asyncHandler(async (req, res) => {
  const suppliers = await Supplier.find({ company: req.company._id }).sort({ createdAt: -1 });
  res.status(200).json(suppliers);
});

// @desc    Create a supplier
// @route   POST /api/suppliers
// @access  Private
const createSupplier = asyncHandler(async (req, res) => {
  const { name, contactPerson, email, phone, address } = req.body;

  if (!name || !email || !phone) {
    res.status(400);
    throw new Error('Please add all required fields');
  }

  const supplier = await Supplier.create({
    name,
    contactPerson,
    email,
    phone,
    address,
    company: req.company._id,
  });

  res.status(201).json(supplier);
});

// @desc    Delete a supplier
// @route   DELETE /api/suppliers/:id
// @access  Private
const deleteSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findOneAndDelete({ _id: req.params.id, company: req.company._id });
  if (!supplier) {
    res.status(404);
    throw new Error('Supplier not found');
  }
  res.status(200).json({ id: req.params.id });
});

module.exports = { getSuppliers, createSupplier, deleteSupplier };