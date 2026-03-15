const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Patient = require('./models/Patient');
const MedicalRecord = require('./models/MedicalRecord');

dotenv.config();

const seedMedicalRecords = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding medical records...');

    // Clear existing medical records to avoid duplicates on re-run
    await MedicalRecord.deleteMany({});

    // Find or create a specific patient to ensure data consistency for testing
    let patient = await Patient.findOne({ name: 'Kritika Gupta' });
    const user = await User.findOne({ role: 'manager' });

    if (!user) {
      console.log('Please seed users with a "manager" role first.');
      process.exit();
    }

    if (!patient) {
      console.log('Patient "Kritika Gupta" not found. Creating her now...');
      patient = await Patient.create({
        name: 'Kritika Gupta',
        age: 28,
        gender: 'Female',
        contact: '09305955072',
        email: 'k21ritikasuvi2106@gmail.com',
        bloodGroup: 'O+',
        allergies: ['Penicillin', 'Sulfa Drugs', 'Latex'],
        company: user.company,
      });
    }

    const records = [
      {
        patient: patient._id,
        company: user.company,
        recordedBy: user._id,
        eventType: 'Vitals',
        data: { heartRate: 75, bp: '122/81', temp: 98.7 },
        eventDate: new Date(new Date().setDate(new Date().getDate() - 2)),
      },
      {
        patient: patient._id,
        company: user.company,
        recordedBy: user._id,
        eventType: 'Prescription',
        data: {
          medication: 'Lisinopril',
          dosage: '10mg',
          instructions: 'Once daily in the morning',
          status: 'Active',
        },
        eventDate: new Date(new Date().setDate(new Date().getDate() - 2)),
      },
      {
        patient: patient._id,
        company: user.company,
        recordedBy: user._id,
        eventType: 'LabResult',
        data: {
          testName: 'Lipid Panel',
          results: [
            { name: 'Total Cholesterol', value: '190', unit: 'mg/dL', isAbnormal: false },
            { name: 'HDL', value: '55', unit: 'mg/dL', isAbnormal: false },
            { name: 'LDL', value: '110', unit: 'mg/dL', isAbnormal: true },
          ],
        },
        eventDate: new Date(new Date().setDate(new Date().getDate() - 1)),
      },
    ];

    await MedicalRecord.insertMany(records);
    console.log(`${records.length} medical records seeded successfully!`);

    process.exit();
  } catch (error) {
    console.error(`Error seeding medical records: ${error.message}`);
    process.exit(1);
  }
};

seedMedicalRecords();