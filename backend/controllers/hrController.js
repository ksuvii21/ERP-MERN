const Employee = require('../models/Employee');
const Payroll = require('../models/Payroll');

// @desc    Salary Calculator Engine
// @route   POST /api/hr/calculate-salary
const calculateSalary = async (req, res) => {
  const { employeeId, month, year } = req.body;

  try {
    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    const { basic, hra, da, allowances, pfDeduction, taxDeduction } = employee.salaryStructure;

    // Calculations
    const gross = basic + hra + da + allowances;
    const pf = (basic * (pfDeduction / 100));
    const tax = taxDeduction; 
    const totalDeductions = pf + tax;
    const netSalary = gross - totalDeductions;

    const payrollDraft = {
      employee: employeeId,
      month,
      year,
      salaryDetails: {
        basic, hra, da, allowances, gross,
        deductions: { pf, tax, other: 0 },
        netSalary
      },
      status: 'Draft'
    };

    res.json(payrollDraft);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate Payslip JSON
// @route   GET /api/hr/payslip/:id
const generatePayslip = async (req, res) => {
    const payroll = await Payroll.findById(req.params.id).populate('employee');
    if(!payroll) return res.status(404).json({message: 'Payroll record not found'});
    res.json(payroll);
};

module.exports = { calculateSalary, generatePayslip };