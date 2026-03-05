const express = require('express');
const router = express.Router();
const { getSales, createSale } = require('../controllers/salesController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getSales).post(protect, createSale);

module.exports = router;