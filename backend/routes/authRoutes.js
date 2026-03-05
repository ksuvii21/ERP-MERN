const express = require('express');
const router = express.Router();
const { registerCompanyAndAdmin, loginCompany } = require('../controllers/authController');

router.post('/register-company', registerCompanyAndAdmin);
router.post('/login', loginCompany);

module.exports = router;