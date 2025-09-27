const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  spotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination', required: true },
  userName: { type: String, required: true },
  comment: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
  sentiment: { type: String, enum: ['Positive', 'Negative', 'Neutral'] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);