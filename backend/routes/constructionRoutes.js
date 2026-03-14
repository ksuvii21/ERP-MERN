const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  getProjects, addProject, 
  getWorkers, addWorker,
  getBudgets, addBudget,
  getContracts, addContract,
  getEquipment, addEquipment 
} = require('../controllers/constructionController');

router.use(protect);

router.route('/projects').get(getProjects).post(addProject);
router.route('/workers').get(getWorkers).post(addWorker);
router.route('/budgets').get(getBudgets).post(addBudget);
router.route('/contracts').get(getContracts).post(addContract);
router.route('/equipment').get(getEquipment).post(addEquipment);

module.exports = router;