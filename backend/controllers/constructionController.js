const asyncHandler = require('express-async-handler');
const ConstructionProject = require('../models/ConstructionProject');
const Worker = require('../models/Worker');
const ConstructionBudget = require('../models/ConstructionBudget');
const Contract = require('../models/Contract');
const Equipment = require('../models/Equipment');

// @desc    Get all construction projects
// @route   GET /api/construction/projects
const getProjects = asyncHandler(async (req, res) => {
  const projects = await ConstructionProject.find({ company: req.company._id });
  res.json(projects);
});

// @desc    Add new project
// @route   POST /api/construction/projects
const addProject = asyncHandler(async (req, res) => {
  const project = await ConstructionProject.create({ ...req.body, company: req.company._id });
  res.status(201).json(project);
});

// @desc    Get all workers
// @route   GET /api/construction/workers
const getWorkers = asyncHandler(async (req, res) => {
  const workers = await Worker.find({ company: req.company._id });
  res.json(workers);
});

// @desc    Add new worker
// @route   POST /api/construction/workers
const addWorker = asyncHandler(async (req, res) => {
  const worker = await Worker.create({ ...req.body, company: req.company._id });
  res.status(201).json(worker);
});

// @desc    Get all budgets
// @route   GET /api/construction/budgets
const getBudgets = asyncHandler(async (req, res) => {
  const budgets = await ConstructionBudget.find({ company: req.company._id }).populate('project', 'name');
  res.json(budgets);
});

// @desc    Add new budget
// @route   POST /api/construction/budgets
const addBudget = asyncHandler(async (req, res) => {
  const budget = await ConstructionBudget.create({ ...req.body, company: req.company._id });
  const populated = await ConstructionBudget.findById(budget._id).populate('project', 'name');
  res.status(201).json(populated);
});

// @desc    Get all contracts
// @route   GET /api/construction/contracts
const getContracts = asyncHandler(async (req, res) => {
  const contracts = await Contract.find({ company: req.company._id });
  res.json(contracts);
});

// @desc    Add new contract
// @route   POST /api/construction/contracts
const addContract = asyncHandler(async (req, res) => {
  const contract = await Contract.create({ ...req.body, company: req.company._id });
  res.status(201).json(contract);
});

// @desc    Get all equipment
// @route   GET /api/construction/equipment
const getEquipment = asyncHandler(async (req, res) => {
  const equipment = await Equipment.find({ company: req.company._id });
  res.json(equipment);
});

// @desc    Add new equipment
// @route   POST /api/construction/equipment
const addEquipment = asyncHandler(async (req, res) => {
  const item = await Equipment.create({ ...req.body, company: req.company._id });
  res.status(201).json(item);
});

module.exports = { 
  getProjects, addProject, 
  getWorkers, addWorker,
  getBudgets, addBudget,
  getContracts, addContract,
  getEquipment, addEquipment
};