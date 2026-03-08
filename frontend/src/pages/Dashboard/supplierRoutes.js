const express = require('express');
const router = express.Router();
const { getSuppliers, createSupplier, deleteSupplier } = require('../controllers/supplierController');
const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/permissionMiddleware');
const { PERMISSIONS } = require('../config/permissions');

router.get('/', protect, checkPermission(PERMISSIONS.SUPPLIERS_READ), getSuppliers);
router.post('/', protect, checkPermission(PERMISSIONS.SUPPLIERS_WRITE), createSupplier);
router.delete('/:id', protect, checkPermission(PERMISSIONS.SUPPLIERS_WRITE), deleteSupplier);

module.exports = router;