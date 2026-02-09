const express = require('express');
const router = express.Router();
const { getSales, createSale } = require('../controllers/salesController');
// const { protect } = require('../middleware/authMiddleware'); // Implement auth middleware later

router.get('/', getSales);
router.post('/', createSale);

module.exports = router;