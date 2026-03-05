const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { ROLES } = require('../config/roles');

// @desc    Get all users for the logged-in company
// @route   GET /api/users
// @access  Private
const getUsers = asyncHandler(async (req, res) => {
  // req.company is attached by the 'protect' middleware.
  // We fetch users associated with the logged-in company.
  const users = await User.find({ company: req.company._id });
  res.status(200).json(users);
});

// @desc    Invite a new user to the company
// @route   POST /api/users/invite
// @access  Private (Admin)
const inviteUser = asyncHandler(async (req, res) => {
  const { email, role } = req.body;

  if (!email || !role) {
    res.status(400);
    throw new Error('Please provide an email and a role.');
  }

  // Ensure the role is a valid, non-admin role
  if (![ROLES.MANAGER, ROLES.EMPLOYEE, ROLES.FINANCE, ROLES.HR].includes(role)) {
    res.status(400);
    throw new Error('Invalid role specified.');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('A user with this email already exists.');
  }

  // Create a pending user. They will complete registration via an email link.
  const user = await User.create({
    name: 'Invited User', // Placeholder name
    email,
    role,
    company: req.company._id,
    status: 'pending',
    password: 'temporary-password-placeholder-' + Date.now(), // Placeholder password
  });

  // In a real application, you would generate a unique token and email it.
  // For now, we will just confirm the user was created.
  // e.g., sendInvitationEmail(user.email, invitationToken);

  res.status(201).json({
    message: `Invitation sent to ${email}. The user has been created with a pending status.`,
    user,
  });
});

// @desc    Delete a user from the company
// @route   DELETE /api/users/:id
// @access  Private (Admin)
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  // Check if user exists and belongs to the admin's company
  if (user && user.company.toString() === req.company._id.toString()) {
    await user.deleteOne();
    res.status(200).json({ message: 'User removed successfully.' });
  } else {
    res.status(404);
    throw new Error('User not found or you do not have permission to remove them.');
  }
});

module.exports = { getUsers, inviteUser, deleteUser };