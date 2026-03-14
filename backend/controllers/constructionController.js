const asyncHandler = require('express-async-handler');
const ConstructionProject = require('../models/ConstructionProject');
const Worker = require('../models/Worker');

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

module.exports = { getProjects, addProject, getWorkers, addWorker };