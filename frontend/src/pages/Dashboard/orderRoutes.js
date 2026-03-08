const express = require('express');
const router = express.Router();
const { getOrders, createOrder, deleteOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/permissionMiddleware');
const { PERMISSIONS } = require('../config/permissions');

router.get('/', protect, checkPermission(PERMISSIONS.ORDERS_READ), getOrders);
router.post('/', protect, checkPermission(PERMISSIONS.ORDERS_WRITE), createOrder);
router.delete('/:id', protect, checkPermission(PERMISSIONS.ORDERS_WRITE), deleteOrder);

module.exports = router;