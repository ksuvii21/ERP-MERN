const asyncHandler = require('express-async-handler');
const BulkOrder = require('../models/BulkOrder');
const Warehouse = require('../models/Warehouse');
const Shipment = require('../models/Shipment');
const CreditAccount = require('../models/CreditAccount');

// Bulk Orders
const getBulkOrders = asyncHandler(async (req, res) => {
  const orders = await BulkOrder.find({ company: req.company._id });
  res.json(orders);
});

const createBulkOrder = asyncHandler(async (req, res) => {
  const orderCount = await BulkOrder.countDocuments({ company: req.company._id });
  const orderNumber = `BLK-${(orderCount + 1).toString().padStart(4, '0')}`;
  const order = await BulkOrder.create({ ...req.body, orderNumber, company: req.company._id });
  res.status(201).json(order);
});

// Warehouse
const getWarehouses = asyncHandler(async (req, res) => {
  const warehouses = await Warehouse.find({ company: req.company._id });
  res.json(warehouses);
});

const createWarehouse = asyncHandler(async (req, res) => {
  const warehouse = await Warehouse.create({ ...req.body, company: req.company._id });
  res.status(201).json(warehouse);
});

// Logistics
const getShipments = asyncHandler(async (req, res) => {
  const shipments = await Shipment.find({ company: req.company._id }).populate('orderId');
  res.json(shipments);
});

// Credit Mgmt
const getCreditAccounts = asyncHandler(async (req, res) => {
  const accounts = await CreditAccount.find({ company: req.company._id });
  res.json(accounts);
});

const createCreditAccount = asyncHandler(async (req, res) => {
  const account = await CreditAccount.create({ ...req.body, company: req.company._id });
  res.status(201).json(account);
});

module.exports = {
  getBulkOrders, createBulkOrder,
  getWarehouses, createWarehouse,
  getShipments,
  getCreditAccounts, createCreditAccount,
};