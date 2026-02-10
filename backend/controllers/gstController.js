const TaxRule = require('../models/TaxRule');
const crypto = require('crypto');

// @desc    Tax Rule Engine: Calculate Tax
// @route   POST /api/gst/calculate
const calculateTax = async (req, res) => {
  const { amount, hsnCode, isInterstate } = req.body;
  
  try {
    // Fetch rule from DB or default to 18%
    const rule = await TaxRule.findOne({ hsnCode, isActive: true });
    const rate = rule ? rule.gstRate : 18;
    
    const taxAmount = (amount * rate) / 100;
    
    let taxDetails = {
      taxableValue: amount,
      rate: rate,
      igst: 0,
      cgst: 0,
      sgst: 0,
      cess: rule ? (amount * rule.cess) / 100 : 0,
      totalTax: taxAmount
    };

    if (isInterstate) {
      taxDetails.igst = taxAmount;
    } else {
      taxDetails.cgst = taxAmount / 2;
      taxDetails.sgst = taxAmount / 2;
    }
    
    res.json(taxDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate E-Invoice IRN (Simulation)
// @route   POST /api/gst/e-invoice/generate
const generateIRN = async (req, res) => {
  const { invoiceNo, gstin, year } = req.body;
  // Standard IRN logic: SHA256 of GSTIN + Year + DocType + DocNum
  const rawString = `${gstin}${year}INV${invoiceNo}`;
  const irn = crypto.createHash('sha256').update(rawString).digest('hex');
  
  res.json({ 
    irn, 
    ackNo: Math.floor(100000000000000 + Math.random() * 900000000000000).toString(),
    ackDate: new Date().toISOString()
  });
};

// @desc    Export GSTR-1 JSON
// @route   GET /api/gst/gstr1/export
const exportGSTR1 = async (req, res) => {
    // Logic to aggregate Invoices from DB would go here
    // Returning mock structure for JSON download
    const data = { gstin: "27ABCDE1234F1Z5", fp: "022026", b2b: [], b2c: [] };
    res.header('Content-Type', 'application/json');
    res.attachment('GSTR1.json');
    res.send(JSON.stringify(data, null, 2));
};

module.exports = { calculateTax, generateIRN, exportGSTR1 };