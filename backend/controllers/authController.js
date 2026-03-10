const Company = require('../models/Company');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const { ROLES } = require('../config/roles'); 
const { ROLE_PERMISSIONS } = require('../config/permissions');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs');

/**
 * @desc    Register a new company and admin
 * @route   POST /api/auth/register-company
 * @access  Public
 */
const registerCompanyAndAdmin = asyncHandler(async (req, res) => {
  const { company, admin } = req.body;

  // 1. Validation
  const requiredCompanyFields = ['name', 'industryType', 'companySize', 'country', 'timezone'];
  const requiredAdminFields = ['name', 'email', 'password'];

  const missingFields = [
    ...requiredCompanyFields.filter(f => !company?.[f]).map(f => `company.${f}`),
    ...requiredAdminFields.filter(f => !admin?.[f]).map(f => `admin.${f}`)
  ];

  if (missingFields.length > 0) {
    res.status(400);
    throw new Error(`Missing fields: ${missingFields.join(', ')}`);
  }

  // 2. Prevent Duplicate Key Errors (Pre-check)
  const userExists = await User.findOne({ email: admin.email });
  if (userExists) {
    res.status(400);
    throw new Error('A user with this email already exists.');
  }

  const companyExists = await Company.findOne({ name: company.name });
  if (companyExists) {
    res.status(400);
    throw new Error('A company with this name already exists.');
  }

  let createdCompany = null;
  let createdAdmin = null;

  try {
    // STEP 1: Create Company first
    // We create the company first so we have the ID ready for the User
    createdCompany = await Company.create({
      ...company,
      email: admin.email 
    });

    // STEP 2: Create Admin (Linking the Company ID immediately)
    // This avoids calling .save() twice on the User object, preventing versioning errors.
    createdAdmin = await User.create({
      name: admin.name,
      email: admin.email,
      password: admin.password,
      role: ROLES.ADMIN,
      company: createdCompany._id, // LINKED HERE
      status: 'active',
      permissions: ROLE_PERMISSIONS[ROLES.ADMIN] || [],
    });

    // STEP 3: Link Owner to Company
    // Updating the company is safe as it doesn't have password-hashing hooks.
    createdCompany.owner = createdAdmin._id;
    await createdCompany.save();

    // SUCCESS: Send response. Redux will see 201 and set isSuccess: true
    res.status(201).json({
      _id: createdAdmin._id,
      name: createdAdmin.name,
      email: createdAdmin.email,
      role: createdAdmin.role,
      company: createdCompany,
      permissions: createdAdmin.permissions,
      token: generateToken(createdAdmin._id, createdAdmin.role),
    });

  } catch (error) {
    // ROLLBACK: Cleanup if anything failed mid-process
    if (createdAdmin) await User.findByIdAndDelete(createdAdmin._id);
    if (createdCompany) await Company.findByIdAndDelete(createdCompany._id);

    console.error('Registration Failure:', error);
    res.status(400); // Bad Request

    // Provide a cleaner error for Mongoose validation issues
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      throw new Error(messages.join('. '));
    }

    throw new Error(error.message || 'User registration failed. Please try again.');
  }
});

/**
 * @desc    Authenticate a user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide an email and password');
  }

  const user = await User.findOne({ email }).select('+password').populate('company');

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company,
      permissions: user.permissions,
      token: generateToken(user._id, user.role),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

module.exports = { registerCompanyAndAdmin, loginUser };