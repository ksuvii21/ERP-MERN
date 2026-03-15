const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Company = require('./models/Company');
const { ROLES, PERMISSIONS } = require('./config/roles');

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding users...');

    // 1. Find or Create Company
    // Try to find "MCMT" or the first available company
    let company = await Company.findOne({ name: 'MCMT' });
    if (!company) {
      company = await Company.findOne();
    }

    if (!company) {
      company = await Company.create({
        name: 'MCMT',
        industryType: 'Technology',
      });
      console.log('Created new company: "MCMT"');
    } else {
      console.log(`Using existing company: "${company.name}"`);
    }

    // 2. Define a list of users with different roles
    const users = [
    //   {
    //     name: 'Super Admin',
    //     email: 'superadmin@erp.com',
    //     password: 'password123',
    //     role: ROLES.SUPER_ADMIN,
    //     status: 'active',
    //     permissions: PERMISSIONS[ROLES.SUPER_ADMIN],
    //   },
    //   {
    //     name: 'Admin User',
    //     email: 'admin@erp.com',
    //     password: 'password123',
    //     role: ROLES.ADMIN,
    //     status: 'active',
    //     company: company._id,
    //     permissions: PERMISSIONS[ROLES.ADMIN],
    //   },
      {
        name: 'Manager User',
        email: 'manager@erp.com',
        password: '123456',
        role: ROLES.MANAGER,
        status: 'active',
        company: company._id,
        permissions: PERMISSIONS[ROLES.MANAGER],
      },
      {
        name: 'Employee User',
        email: 'employee@erp.com',
        password: '123456',
        role: ROLES.EMPLOYEE,
        status: 'active',
        company: company._id,
        permissions: PERMISSIONS[ROLES.EMPLOYEE],
      },
    ];

    // 3. Insert the users into the database
    // Only delete the specific seed users to prevent duplicates, keeping other data intact
    const userEmails = users.map(u => u.email);
    await User.deleteMany({ email: { $in: userEmails } });

    // Use a loop with create() instead of insertMany() to ensure password hashing middleware runs
    for (const user of users) {
      await User.create(user);
    }
    console.log('Users with roles (manager, employee) seeded successfully!');

    process.exit();
  } catch (error) {
    console.error(`Error seeding users: ${error.message}`);
    process.exit(1);
  }
};

seedUsers();