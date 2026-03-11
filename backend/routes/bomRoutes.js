const express = require('express');
const router = express.Router();
const { getBoms, createBom, getBom, updateBom, deleteBom } = require('../controllers/bomController');
const { protect, hasPermission } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

router.route('/')
  .get(hasPermission('manage_bom', 'view_bom'), getBoms)
  .post(hasPermission('manage_bom'), createBom);

router.route('/:id')
  .get(hasPermission('manage_bom', 'view_bom'), getBom)
  .patch(hasPermission('manage_bom'), updateBom)
  .delete(hasPermission('manage_bom'), deleteBom);

module.exports = router;