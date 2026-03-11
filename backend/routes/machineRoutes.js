const express = require('express');
const router = express.Router();
const { getMachines, createMachine, getMachine, updateMachine, deleteMachine } = require('../controllers/machineController');
const { protect, hasPermission } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(hasPermission('manage_machines'), getMachines)
  .post(hasPermission('manage_machines'), createMachine);

router.route('/:id')
  .get(hasPermission('manage_machines'), getMachine)
  .patch(hasPermission('manage_machines'), updateMachine)
  .delete(hasPermission('manage_machines'), deleteMachine);

module.exports = router;