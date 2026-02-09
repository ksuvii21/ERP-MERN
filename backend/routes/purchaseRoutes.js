const express = require('express');
const router = express.Router();
const { getPurchases } = require('../controllers/purchaseController');

router.get('/', getPurchases);

module.exports = router;