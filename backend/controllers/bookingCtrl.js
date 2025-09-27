// backend/controllers/bookingCtrl.js

const Booking = require('../models/Booking');

// Create a new booking
exports.create = async (req, res) => {
    try {
        const userId = req.user.id; // From the auth middleware
        const { homestayId, startDate, endDate, guests, name, phone } = req.body;

        if (!homestayId || !startDate || !endDate || !guests || !name || !phone) {
            return res.status(400).json({ message: 'All booking fields are required.' });
        }

        const booking = await Booking.create({
            user: userId,
            homestay: homestayId,
            startDate,
            endDate,
            guests,
            userName: name,
            userPhone: phone,
        });

        res.status(201).json(booking);
    } catch (err) {
        console.error('Booking creation error:', err);
        res.status(500).json({ message: 'Server error while creating booking.' });
    }
};

// List all bookings for the logged-in user
exports.list = async (req, res) => {
    try {
        // Find bookings and populate the 'homestay' field with its name and location
        const bookings = await Booking.find({ user: req.user.id })
            .populate('homestay', 'name location')
            .sort({ createdAt: -1 }); // Show most recent first
        res.json(bookings);
    } catch (err) {
        console.error('Error listing bookings:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Placeholder for getting a single booking
exports.getById = (req, res) => {
    res.send('Get booking by ID.');
};