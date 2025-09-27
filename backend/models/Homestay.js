const mongoose = require('mongoose');

const homestaySchema = new mongoose.Schema({
    name: String,
    location: String,
    description: String,
    pricePerNight: Number,
    amenities: [String],
    images: [String],
    host: {
        name: String,
        phone: String,
        email: String
    },
    coordinates: {
        lat: Number,
        lng: Number
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Homestay', homestaySchema);
