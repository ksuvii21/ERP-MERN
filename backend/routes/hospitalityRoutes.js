const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getRooms, addRoom,
  getGuests, addGuest,
  getBookings, addBooking, updateBookingStatus,
  getServices, addService
} = require('../controllers/hospitalityController');

router.use(protect);

router.route('/rooms').get(getRooms).post(addRoom);
router.route('/guests').get(getGuests).post(addGuest);
router.route('/bookings').get(getBookings).post(addBooking);
router.patch('/bookings/:id/status', updateBookingStatus);
router.route('/services').get(getServices).post(addService);

module.exports = router;