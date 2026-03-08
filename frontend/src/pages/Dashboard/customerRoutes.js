const express = require('express');
const router = express.Router();
const { getCustomers, createCustomer, deleteCustomer } = require('../controllers/customerController');
const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/permissionMiddleware');
const { PERMISSIONS } = require('../config/permissions');

router.get('/', protect, checkPermission(PERMISSIONS.CUSTOMERS_READ), getCustomers);
router.post('/', protect, checkPermission(PERMISSIONS.CUSTOMERS_WRITE), createCustomer);
router.delete('/:id', protect, checkPermission(PERMISSIONS.CUSTOMERS_WRITE), deleteCustomer);

module.exports = router;