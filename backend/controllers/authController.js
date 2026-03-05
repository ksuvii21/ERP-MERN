const Company = require('../models/Company');
const User = require('../models/User');
const asyncHandler = require('express-async-handler'); // npm i express-async-handler
const jwt = require('jsonwebtoken'); // npm i jsonwebtoken
const { ROLES } = require('../config/roles');
const bcrypt = require('bcryptjs');

// Generate JWT
const generateToken = (id, role) => {
  if (!process.env.JWT_SECRET) {
    // This is a critical server configuration error.
    console.error('FATAL ERROR: JWT_SECRET is not defined in .env file.');
    throw new Error('Server configuration error, cannot sign authentication tokens.');
  }
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { // id will be user id
    expiresIn: '30d',
  });
};

/**
 * @desc    Register a new company
 * @route   POST /api/auth/register-company
 * @access  Public
 */
const registerCompanyAndAdmin = asyncHandler(async (req, res) => {
  const { company, admin } = req.body;

  if (!company || !admin || !admin.email || !admin.password || !company.name) {
    res.status(400);
    throw new Error('Please provide all required fields for company and admin');
  }

  // 1. Check if user or company already exist
  const userExists = await User.findOne({ email: admin.email });
  if (userExists) {
    res.status(400);
    throw new Error('A company with this email already exists.');
  }

  const companyExists = await Company.findOne({ name: company.name });
  if (companyExists) {
    res.status(400);
    throw new Error('A company with this name already exists.');
  }

  // Use a session for transaction-like behavior
  const session = await Company.startSession();
  session.startTransaction();

  try {
    // 2. Create the admin user
    const adminUser = new User({
      name: 'Admin', // Or get from form
      email: admin.email,
      password: admin.password,
      role: ROLES.ADMIN,
      // Company will be set after company is created
    });

    // 3. Create the company
    const newCompany = new Company({
      ...company,
      owner: adminUser._id,
    });

    // 4. Link user to company and save both
    adminUser.company = newCompany._id;
    await newCompany.save({ session });
    await adminUser.save({ session });

    await session.commitTransaction();

    // 5. Respond with a token for the new admin user
    res.status(201).json({
      _id: adminUser._id,
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role,
      token: generateToken(adminUser._id, adminUser.role),
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(400);
    throw new Error('User registration failed. ' + error.message);
  } finally {
    session.endSession();
  }
});

/**
 * @desc    Authenticate a user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1. Check for email and password
  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide an email and password');
  }

  // 2. Check if user exists and get password
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    // For security, we send a generic message to the client.
    // The console log is for server-side debugging.
    console.log(`Auth-Debug: Login failed. User not found for email: ${email}`);
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch) {
    // 3. If password matches, send back data and token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } else {
    console.log(`Auth-Debug: Login failed. Incorrect password for email: ${email}`);
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

module.exports = { registerCompanyAndAdmin, loginUser };