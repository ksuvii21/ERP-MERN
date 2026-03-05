const express = require('express');
const router = express.Router();
const { getUsers, inviteUser, deleteUser, acceptInvitation } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../config/roles');

// This route will now securely get all users associated with the logged-in company.
router.get('/', protect, authorize(ROLES.ADMIN, ROLES.HR, ROLES.MANAGER), getUsers);
router.post('/invite', protect, authorize(ROLES.ADMIN), inviteUser);
router.delete('/:id', protect, authorize(ROLES.ADMIN), deleteUser);
router.post('/accept-invitation', acceptInvitation);

module.exports = router;