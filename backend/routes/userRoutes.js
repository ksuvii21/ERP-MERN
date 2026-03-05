const express = require('express');
const router = express.Router();
const { getUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// This route will now securely get all users associated with the logged-in company.
router.get('/', protect, getUsers);

module.exports = router;