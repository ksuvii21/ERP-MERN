const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const { ROLES } = require('./config/roles.js');

dotenv.config();

const users = [
  {
    name: 'Super Admin',
    email: 'super@erp.com',
    password: 'password123',
    role: ROLES.SUPER_ADMIN,
  },
  {
    name: 'Admin User',
    email: 'admin@erp.com',
    password: 'password123',
    role: ROLES.ADMIN,
  },
  {
    name: 'Manager User',
    email: 'manager@erp.com',
    password: 'password123',
    role: ROLES.MANAGER,
  },
  {
    name: 'Employee User',
    email: 'employee@erp.com',
    password: 'password123',
    role: ROLES.EMPLOYEE,
  },
  {
    name: 'HR User',
    email: 'hr@erp.com',
    password: 'password123',
    role: ROLES.HR,
  },
  {
    name: 'Finance User',
    email: 'finance@erp.com',
    password: 'password123',
    role: ROLES.FINANCE,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    // Clear existing users
    await User.deleteMany({});
    console.log('Existing users cleared...');

    // Create users
    for (const user of users) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      await User.create(user);
    }

    console.log('Users Seeded Successfully. Use these credentials to login:');
    users.forEach(u => console.log(`${u.role}: ${u.email} / password123`));
    
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();