const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS middleware
app.use(cors());

// --- API Routes ---
// The missing piece: Registering your auth routes
app.use('/api/auth', require('./routes/authRoutes')); 

// Registering other existing routes to prevent future 404s
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/purchases', require('./routes/purchaseRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/sales', require('./routes/salesRoutes'));
// Add other routes like 'invoices', 'grn', etc. here as you build them
app.use('/api/invoices', require('./routes/invoiceRoutes'));
app.use('/api/grn', require('./routes/grnRoutes'));

// Register Customer, Supplier, and Order Routes
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/suppliers', require('./routes/supplierRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// Register Manufacturing Routes
app.use('/api/boms', require('./routes/bomRoutes'));
app.use('/api/production', require('./routes/productionRoutes'));
app.use('/api/quality', require('./routes/qualityRoutes'));
app.use('/api/machines', require('./routes/machineRoutes'));

// Register Healthcare Routes
app.use('/api', require('./routes/healthcareRoutes'));

// Error Handler Middleware (Must be after routes)
app.use(errorHandler);


// --- Deployment ---
// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('*', (req, res) =>
    res.sendFile(
      path.resolve(__dirname, '../', 'frontend', 'dist', 'index.html')
    )
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

// --- Server ---
const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
);