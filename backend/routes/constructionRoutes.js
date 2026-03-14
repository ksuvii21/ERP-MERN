const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getProjects, addProject, getWorkers, addWorker } = require('../controllers/constructionController');

router.use(protect);

router.route('/projects').get(getProjects).post(addProject);
router.route('/workers').get(getWorkers).post(addWorker);
// Add placeholder routes for Budgets, Contracts, Equipment to prevent 404s
router.get('/budgets', (req, res) => res.json([]));
router.get('/contracts', (req, res) => res.json([]));
router.get('/equipment', (req, res) => res.json([]));

module.exports = router;