const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Patient = require('./models/Patient');
const Company = require('./models/Company');
const Invoice = require('./models/Invoice');

dotenv.config();

const seedInvoices = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected for invoice seeding...');

        await Invoice.deleteMany({});

        const patient = await Patient.findOne({ name: 'Kritika Gupta' });
        const company = await Company.findOne();

        if (!patient || !company) {
            console.log('Please ensure at least one patient (Kritika Gupta) and one company exist.');
            process.exit();
        }

        const invoices = [];
        const statuses = ['Draft', 'Open', 'Partial', 'Paid', 'Pro-forma'];

        for (let i = 0; i < 10; i++) {
            const items = [
                { source: 'Consultation', description: 'General Physician Consult', quantity: 1, price: 50, total: 50 },
                { source: 'Pharmacy', description: `Paracetamol 500mg (x10)`, quantity: 1, price: 5, total: 5 },
                { source: 'Lab', description: 'Complete Blood Count (CBC)', quantity: 1, price: 25, total: 25 },
            ];
            if (i % 3 === 0) {
                items.push({ source: 'Room Rent', description: 'Private Ward - 1 Day', quantity: 1, price: 200, total: 200 });
            }

            const totalAmount = items.reduce((sum, item) => sum + item.total, 0);
            const status = statuses[i % statuses.length];
            
            let ledgerEntries = [{ date: new Date(), amount: totalAmount, type: 'Debit', method: 'System Generated' }];
            let insurancePayable = totalAmount * 0.8;
            let patientPayable = totalAmount * 0.2;

            if (status === 'Partial') {
                const partialPayment = patientPayable / 2;
                ledgerEntries.push({ date: new Date(), amount: partialPayment, type: 'Credit', method: 'Cash' });
            } else if (status === 'Paid') {
                ledgerEntries.push({ date: new Date(), amount: patientPayable, type: 'Credit', method: 'Card' });
                ledgerEntries.push({ date: new Date(), amount: insurancePayable, type: 'Credit', method: 'Insurance Adjustment' });
            }

            invoices.push({
                company: company._id,
                patient: patient._id,
                customerName: patient.name,
                invoiceNumber: `INV-${String(Date.now()).slice(-6)}-${i}`, // Generate unique invoice number
                invoiceDate: new Date(new Date().setDate(new Date().getDate() - (15 - i))),
                dueDate: new Date(new Date().setDate(new Date().getDate() + i)),
                items,
                totalAmount,
                insurancePayable,
                patientPayable,
                status,
                ledgerEntries,
                notes: `This is a sample invoice #${i + 1}.`
            });
        }

        await Invoice.insertMany(invoices);
        console.log(`${invoices.length} Odoo-style invoices seeded successfully!`);
        process.exit();

    } catch (error) {
        console.error(`Error seeding invoices: ${error.message}`);
        process.exit(1);
    }
};

seedInvoices();