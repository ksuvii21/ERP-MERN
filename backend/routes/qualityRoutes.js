const express = require('express');
const router = express.Router();
const { getQualityChecks, createQualityCheck, getQualityCheck, updateQualityCheck, deleteQualityCheck } = require('../controllers/qualityController');
const { protect, hasPermission } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(hasPermission('manage_quality'), getQualityChecks)
  .post(hasPermission('manage_quality'), createQualityCheck);

router.route('/:id')
  .get(hasPermission('manage_quality'), getQualityCheck)
  .patch(hasPermission('manage_quality'), updateQualityCheck)
  .delete(hasPermission('manage_quality'), deleteQualityCheck);

module.exports = router;