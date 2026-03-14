const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getBulkOrders, createBulkOrder,
  getWarehouses, createWarehouse,
  getShipments,
  getCreditAccounts, createCreditAccount,
} = require('../controllers/wholesaleController');

router.use(protect);

router.route('/bulk-orders').get(getBulkOrders).post(createBulkOrder);
router.route('/warehouses').get(getWarehouses).post(createWarehouse);
router.get('/shipments', getShipments);
router.route('/credit-accounts').get(getCreditAccounts).post(createCreditAccount);

module.exports = router;