const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const { ROLES } = require('../config/roles.js');

// @route   GET api/users
// @desc    Get all users
// @access  Private (Super Admin, Admin, HR)
router.get('/', authMiddleware([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.HR]), async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;