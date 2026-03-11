const express = require('express');
const router = express.Router();
const { getProductionOrders, createProductionOrder, getProductionOrder, updateProductionOrder, deleteProductionOrder } = require('../controllers/productionController');
const { protect, hasPermission } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(hasPermission('manage_production', 'view_production'), getProductionOrders)
  .post(hasPermission('manage_production'), createProductionOrder);

router.route('/:id')
  .get(hasPermission('manage_production', 'view_production'), getProductionOrder)
  .patch(hasPermission('manage_production'), updateProductionOrder)
  .delete(hasPermission('manage_production'), deleteProductionOrder);

module.exports = router;