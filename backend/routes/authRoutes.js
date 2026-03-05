const express = require('express');
const router = express.Router();
const { registerCompanyAndAdmin, loginUser } = require('../controllers/authController');

router.post('/register-company', registerCompanyAndAdmin);
router.post('/login', loginUser);

module.exports = router;