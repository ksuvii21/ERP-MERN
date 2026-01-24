const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Sale = require('./models/Sale');
const Purchase = require('./models/Purchase');
const User = require('./models/User');

dotenv.config();

const products = [
  { name: 'Laptop', category: 'Electronics', price: 1200, stock: 50, sku: 'LAP-001' },
  { name: 'Office Chair', category: 'Furniture', price: 150, stock: 200, sku: 'CHR-001' },
  { name: 'Monitor', category: 'Electronics', price: 300, stock: 75, sku: 'MON-001' },
  { name: 'Desk', category: 'Furniture', price: 400, stock: 30, sku: 'DSK-001' },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    // Get a user for 'createdBy' fields
    const admin = await User.findOne({ email: 'admin@erp.com' });
    if (!admin) {
      console.log('Please run seedUsers.js first!');
      process.exit(1);
    }

    // Clear Data
    await Product.deleteMany({});
    await Sale.deleteMany({});
    await Purchase.deleteMany({});

    // Insert Products
    const createdProducts = await Product.insertMany(products);
    console.log('Products Seeded');

    // Insert Sales
    const sales = [
      {
        customerName: 'Walk-in Customer',
        products: [{ product: createdProducts[0]._id, quantity: 1, price: 1200 }],
        totalAmount: 1200,
        createdBy: admin._id,
      },
      {
        customerName: 'Corporate Client',
        products: [{ product: createdProducts[1]._id, quantity: 2, price: 150 }],
        totalAmount: 300,
        createdBy: admin._id,
      },
    ];
    await Sale.insertMany(sales);
    console.log('Sales Seeded');

    // Insert Purchases
    const purchases = [
      {
        products: [{ product: createdProducts[2]._id, quantity: 10, cost: 250 }],
        totalAmount: 2500, // Bulk discount maybe?
        supplierName: 'TechSupplier Inc.',
        createdBy: admin._id,
      },
    ];
    await Purchase.insertMany(purchases);
    console.log('Purchases Seeded');

    console.log('Data Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();