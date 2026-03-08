const express = require('express');
const router = express.Router();
const { getUsers, inviteUser, deleteUser, acceptInvitation } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/permissionMiddleware');
const { ROLES } = require('../config/roles');
const { PERMISSIONS } = require('../config/permissions');

// This route will now securely get all users associated with the logged-in company.
router.get('/', protect, checkPermission(PERMISSIONS.EMPLOYEES_READ), getUsers);
router.post('/invite', protect, checkPermission(PERMISSIONS.EMPLOYEES_WRITE), inviteUser);
router.delete('/:id', protect, checkPermission(PERMISSIONS.EMPLOYEES_WRITE), deleteUser);
router.post('/accept-invitation', acceptInvitation);

module.exports = router;