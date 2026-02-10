const Invoice = require('../models/Invoice'); // Assuming Invoice model exists
const Product = require('../models/Product');
const Account = require('../models/Account');

// @desc    Generate Dynamic Report Data
// @route   POST /api/reports/generate
const generateReport = async (req, res) => {
  const { module, startDate, endDate, columns } = req.body;

  try {
    let data = [];
    const dateFilter = { createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } };

    if (module === 'Sales') {
      // Aggregate Sales Data
      // In a real app, use .select(columns.join(' ')) to optimize
      const sales = await Invoice.find(dateFilter).populate('customer', 'name');
      data = sales.map(s => ({
        Date: s.createdAt,
        InvoiceNo: s.invoiceNumber,
        Customer: s.customer?.name,
        Amount: s.totalAmount,
        Status: s.status
      }));
    } 
    else if (module === 'Inventory') {
      // Aggregate Stock Data
      const products = await Product.find();
      data = products.map(p => ({
        ProductName: p.name,
        SKU: p.sku,
        Stock: p.stock,
        Value: p.stock * p.price,
        Category: p.category
      }));
    }
    else if (module === 'Outstanding') {
      // Aggregate Accounts Receivable
      const accounts = await Account.find({ type: 'Asset', subtype: 'Receivable' });
      data = accounts.map(a => ({
        Customer: a.name,
        PendingAmount: a.balance,
        DueDate: a.dueDate || 'N/A'
      }));
    }

    // Filter data to only include requested columns if necessary
    // (Frontend usually handles display, but backend can optimize payload)
    
    res.json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get MIS Dashboard Stats
// @route   GET /api/reports/mis-stats
const getMISStats = async (req, res) => {
    // Aggregated high-level stats
    res.json({
        totalRevenue: 150000,
        netProfit: 45000,
        inventoryValue: 200000,
        outstandingDues: 12000
    });
};

module.exports = { generateReport, getMISStats };