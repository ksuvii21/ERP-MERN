const express = require('express');
const router = express.Router();
const { getEmployees, createEmployee } = require('../controllers/employeeController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../config/roles');

router.route('/')
    .get(protect, authorize(ROLES.ADMIN, ROLES.HR), getEmployees)
    .post(protect, authorize(ROLES.ADMIN, ROLES.HR), createEmployee);

module.exports = router;