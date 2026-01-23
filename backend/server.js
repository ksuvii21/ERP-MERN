const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
// Load env vars
dotenv.config();
const connectDB = require('./config/db');

// Connect to database
console.log('MONGO_URI:', process.env.MONGO_URI);
connectDB();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Route Files
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const salesRoutes = require('./routes/salesRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const grnRoutes = require('./routes/grnRoutes');

// Mount Routers
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/grn', grnRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});