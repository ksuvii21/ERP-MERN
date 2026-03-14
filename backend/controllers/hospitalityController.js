const asyncHandler = require('express-async-handler');
const Room = require('../models/Room');
const Guest = require('../models/Guest');
const Booking = require('../models/Booking');
const Service = require('../models/Service');

// --- Rooms ---
const getRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find({ company: req.company._id });
  res.json(rooms);
});

const addRoom = asyncHandler(async (req, res) => {
  const room = await Room.create({ ...req.body, company: req.company._id });
  res.status(201).json(room);
});

// --- Guests ---
const getGuests = asyncHandler(async (req, res) => {
  const guests = await Guest.find({ company: req.company._id });
  res.json(guests);
});

const addGuest = asyncHandler(async (req, res) => {
  const guest = await Guest.create({ ...req.body, company: req.company._id });
  res.status(201).json(guest);
});

// --- Bookings ---
const getBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ company: req.company._id })
    .populate('guest', 'name phone')
    .populate('room', 'roomNumber type');
  res.json(bookings);
});

const addBooking = asyncHandler(async (req, res) => {
  const { room: roomId, status } = req.body;
  const booking = await Booking.create({ ...req.body, company: req.company._id });
  
  // Automatically update room status if checked in
  if (status === 'Checked In') {
    await Room.findByIdAndUpdate(roomId, { status: 'Occupied' });
  }

  const populated = await Booking.findById(booking._id)
    .populate('guest', 'name phone')
    .populate('room', 'roomNumber type');
  res.status(201).json(populated);
});

const updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  
  booking.status = req.body.status;
  await booking.save();

  if (booking.status === 'Checked Out') {
    await Room.findByIdAndUpdate(booking.room, { status: 'Available' });
  } else if (booking.status === 'Checked In') {
    await Room.findByIdAndUpdate(booking.room, { status: 'Occupied' });
  }

  res.json(booking);
});

// --- Services ---
const getServices = asyncHandler(async (req, res) => {
  const services = await Service.find({ company: req.company._id });
  res.json(services);
});

const addService = asyncHandler(async (req, res) => {
  const service = await Service.create({ ...req.body, company: req.company._id });
  res.status(201).json(service);
});

module.exports = {
  getRooms, addRoom,
  getGuests, addGuest,
  getBookings, addBooking, updateBookingStatus,
  getServices, addService
};