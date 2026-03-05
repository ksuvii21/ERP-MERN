const express = require('express');
const router = express.Router();
const { getPurchases } = require('../controllers/purchaseController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getPurchases);

module.exports = router;