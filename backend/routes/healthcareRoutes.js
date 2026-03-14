const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getPatients, addPatient,
  getDoctors, addDoctor,
  getAppointments, addAppointment,
  getRecords,
  getPharmacy,
  getInvoices
} = require('../controllers/healthcareController');

router.use(protect);

router.route('/patients').get(getPatients).post(addPatient);
router.route('/doctors').get(getDoctors).post(addDoctor);
router.route('/appointments').get(getAppointments).post(addAppointment);
router.get('/records', getRecords);
router.get('/pharmacy', getPharmacy);
router.get('/billing/invoices', getInvoices);

module.exports = router;