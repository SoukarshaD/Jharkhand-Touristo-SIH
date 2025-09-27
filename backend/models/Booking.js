// backend/models/Booking.js

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // The logged-in user who booked
  homestay: { type: mongoose.Schema.Types.ObjectId, ref: 'Homestay' }, // Reference to the homestay
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  guests: { type: Number, required: true, min: 1 },
  userName: { type: String, required: true }, // Name provided in the form
  userPhone: { type: String, required: true }, // Phone provided in the form
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);